<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$full_name = isset($_POST['full_name']) ? trim($_POST['full_name']) : '';
$company_name = isset($_POST['company_name']) ? trim($_POST['company_name']) : '';
$corporate_address = isset($_POST['corporate_address']) ? trim($_POST['corporate_address']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$whatsapp = isset($_POST['whatsapp']) ? trim($_POST['whatsapp']) : '';
$website = isset($_POST['website']) ? trim($_POST['website']) : '';
$vision = isset($_POST['vision']) ? trim($_POST['vision']) : '';

// Validate required fields
if (empty($full_name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Name and email are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

// Email configuration
$to = 'arjun@sriiparadiise.com';
$subject = 'New Inquiry from ' . $full_name . ' — Srii Paradiise';

// Build email body
$body = "New inquiry from the Srii Paradiise website:\n\n";
$body .= "Full Name: " . $full_name . "\n";
$body .= "Company Name: " . $company_name . "\n";
$body .= "Corporate Address: " . $corporate_address . "\n";
$body .= "Email ID: " . $email . "\n";
$body .= "Phone No.: " . $phone . "\n";
$body .= "WhatsApp No.: " . $whatsapp . "\n";
$body .= "Website URL: " . $website . "\n\n";
$body .= "Vision / Thought Process / Collaboration Proposal:\n";
$body .= $vision . "\n\n";
$body .= "---\n";
$body .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
$body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$body .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to, $subject, $body, $headers);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode(['status' => 'ok', 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to send email']);
}
?>
