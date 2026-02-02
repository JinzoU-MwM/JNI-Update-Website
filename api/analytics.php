<?php
/**
 * =====================================================
 * JNI Consultant - Analytics API
 * =====================================================
 * 
 * Endpoints:
 *   GET ?action=daily_views    - Views per day (last 7/30 days)
 *   GET ?action=top_pages      - Top visited pages
 *   GET ?action=referrers      - Top referrer sources
 *   GET ?action=devices        - Device breakdown
 *   GET ?action=overview       - All stats summary
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

// Include database configuration
require_once __DIR__ . '/config.php';

// Optional: Require authentication for sensitive analytics
// Uncomment to protect this endpoint
/*
if (!isset($_SESSION['admin']) || $_SESSION['admin']['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}
*/

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$action = $_GET['action'] ?? 'overview';
$days = min(intval($_GET['days'] ?? 7), 90); // Max 90 days

try {
    $pdo = getDbConnection();
    
    switch ($action) {
        
        case 'daily_views':
            // Get daily view counts for last N days
            $sql = "SELECT 
                        DATE(access_time) as date,
                        COUNT(*) as views,
                        COUNT(DISTINCT ip_address) as unique_visitors
                    FROM visitor_logs 
                    WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
                    GROUP BY DATE(access_time)
                    ORDER BY date ASC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':days' => $days]);
            $data = $stmt->fetchAll();
            
            // Fill missing dates with 0
            $result = [];
            $startDate = new DateTime("-{$days} days");
            $endDate = new DateTime();
            
            $viewsByDate = [];
            foreach ($data as $row) {
                $viewsByDate[$row['date']] = $row;
            }
            
            while ($startDate <= $endDate) {
                $dateStr = $startDate->format('Y-m-d');
                $result[] = [
                    'date' => $dateStr,
                    'label' => $startDate->format('d M'),
                    'views' => intval($viewsByDate[$dateStr]['views'] ?? 0),
                    'unique_visitors' => intval($viewsByDate[$dateStr]['unique_visitors'] ?? 0)
                ];
                $startDate->modify('+1 day');
            }
            
            echo json_encode(['success' => true, 'data' => $result]);
            break;
            
        case 'top_pages':
            $limit = min(intval($_GET['limit'] ?? 10), 50);
            
            $sql = "SELECT 
                        page_url,
                        page_title,
                        COUNT(*) as views,
                        COUNT(DISTINCT ip_address) as unique_visitors
                    FROM visitor_logs 
                    WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
                    GROUP BY page_url, page_title
                    ORDER BY views DESC
                    LIMIT :limit";
            
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':days', $days, PDO::PARAM_INT);
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'referrers':
            $sql = "SELECT 
                        CASE 
                            WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
                            WHEN referrer LIKE '%google%' THEN 'Google'
                            WHEN referrer LIKE '%facebook%' OR referrer LIKE '%fb.%' THEN 'Facebook'
                            WHEN referrer LIKE '%instagram%' THEN 'Instagram'
                            WHEN referrer LIKE '%twitter%' OR referrer LIKE '%t.co%' THEN 'Twitter'
                            WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
                            WHEN referrer LIKE '%youtube%' THEN 'YouTube'
                            ELSE 'Other'
                        END as source,
                        COUNT(*) as visits
                    FROM visitor_logs 
                    WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
                    GROUP BY source
                    ORDER BY visits DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':days' => $days]);
            
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;
            
        case 'devices':
            $sql = "SELECT 
                        device_type,
                        browser,
                        COUNT(*) as count
                    FROM visitor_logs 
                    WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL :days DAY)
                    GROUP BY device_type, browser
                    ORDER BY count DESC";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':days' => $days]);
            $rawData = $stmt->fetchAll();
            
            // Aggregate by device type
            $devices = [];
            $browsers = [];
            foreach ($rawData as $row) {
                $devices[$row['device_type']] = ($devices[$row['device_type']] ?? 0) + $row['count'];
                $browsers[$row['browser']] = ($browsers[$row['browser']] ?? 0) + $row['count'];
            }
            
            echo json_encode([
                'success' => true, 
                'data' => [
                    'devices' => $devices,
                    'browsers' => $browsers
                ]
            ]);
            break;
            
        case 'overview':
        default:
            // Comprehensive overview
            $overview = [];
            
            // Total views today
            $stmt = $pdo->query("SELECT COUNT(*) FROM visitor_logs WHERE DATE(access_time) = CURDATE()");
            $overview['today_views'] = intval($stmt->fetchColumn());
            
            // Total views this week
            $stmt = $pdo->query("SELECT COUNT(*) FROM visitor_logs WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
            $overview['week_views'] = intval($stmt->fetchColumn());
            
            // Total views this month
            $stmt = $pdo->query("SELECT COUNT(*) FROM visitor_logs WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
            $overview['month_views'] = intval($stmt->fetchColumn());
            
            // Total unique visitors this month
            $stmt = $pdo->query("SELECT COUNT(DISTINCT ip_address) FROM visitor_logs WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
            $overview['month_unique'] = intval($stmt->fetchColumn());
            
            // Top page today
            $stmt = $pdo->query("SELECT page_url, COUNT(*) as views FROM visitor_logs WHERE DATE(access_time) = CURDATE() GROUP BY page_url ORDER BY views DESC LIMIT 1");
            $topPage = $stmt->fetch();
            $overview['top_page_today'] = $topPage ? $topPage['page_url'] : 'N/A';
            
            // Device distribution
            $stmt = $pdo->query("SELECT device_type, COUNT(*) as count FROM visitor_logs WHERE access_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) GROUP BY device_type");
            $devices = [];
            while ($row = $stmt->fetch()) {
                $devices[$row['device_type']] = intval($row['count']);
            }
            $overview['devices'] = $devices;
            
            echo json_encode(['success' => true, 'data' => $overview]);
            break;
    }
    
} catch (PDOException $e) {
    error_log("Analytics API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
