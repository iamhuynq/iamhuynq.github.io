<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

$mail = new PHPMailer(true);

// an email address that will be in the From field of the email.
$fromEmail = 'crystal@viet.pro';
$fromName = 'Crystal Holidays';

// an email address that will receive the email with the output of the form
$sendToEmail = 'crystal@viet.pro';
$sendToName = 'Crystal Holidays Manager';

// subject of the email
$subject = 'Message from Crystal Holiday landing page subscribe!' . date('Y-m-d H:i', time());

// form field names and their translations.
// array variable name => Text to appear in the email
$fields = array('name' => 'Name', 'phone' => 'Phone', 'email' => 'Email', 'note' => 'Message');

// message that will be displayed when everything is OK :)
$okMessage = 'We have received your inquiry. Stay tuned, we’ll get back to you very soon.';

// If something goes wrong, we will display this message.
$errorMessage = 'There was an error while submitting the form. Please try again later';

/*
*  LET'S DO THE SENDING
*/
try {
    if(count($_POST) == 0) throw new \Exception('Form is empty');
    $emailTextHtml = "<h4>New subscribe from ECP landing page:</h4>";
    $emailTextHtml .= "<table>";
    
    foreach ($_POST as $key => $value) {
        // If the field exists in the $fields array, include it in the email
        if (isset($fields[$key])) {
            $emailTextHtml .= "<tr><th>$fields[$key]</th><td>$value</td></tr>";
        }
    }

    $emailTextHtml .= "<tr><th>Time</th><td>" . date('Y-m-d H:i:s', time()) . "</td></tr>";
    $emailTextHtml .= "</table>";

    //Server settings
    $mail->SMTPDebug = 0;
    $mail->isSMTP(); // Sử dụng SMTP để gửi mail
    $mail->Host = 'smtp.gmail.com'; // Server SMTP của gmail
    $mail->SMTPAuth = true; // Bật xác thực SMTP
    $mail->Username = 'noreply@viet.pro'; // Tài khoản email
    $mail->Password = 'matkhaudetrong'; // Mật khẩu ứng dụng ở bước 1 hoặc mật khẩu email
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Mã hóa SSL
    $mail->Port = 587; // Cổng kết nối SMTP là 465
    $mail->CharSet = 'UTF-8';

    //Recipients
    $mail->setFrom($fromEmail, $fromName); // Địa chỉ email và tên người gửi
    $mail->addAddress($sendToEmail, $sendToName); // Địa chỉ mail và tên người nhận
    $mail->addReplyTo($fromEmail);

    //Content
    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = $subject; // Tiêu đề
    //$mail->Body = 'This is the HTML message body in bold!'; // Nội dung
    $mail->msgHTML($emailTextHtml); // this will also create a plain-text version of the HTML email, very handy

    if(!$mail->send()) {
        throw new \Exception('I could not send the email.' . $mail->ErrorInfo);
    }
    
    $responseArray = array('type' => 'success', 'message' => $okMessage);
} catch (Exception $e) {
    $responseArray = array('type' => 'danger', 'message' => $e->getMessage());
}

// if you are not debugging and don't need error reporting, turn this off by error_reporting(0);
//error_reporting(E_ALL & ~E_NOTICE);
error_reporting(0);


// if requested by AJAX request return JSON response
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    $encoded = json_encode($responseArray);
    
    header('Content-Type: application/json');
    
    echo $encoded;
}
// else just display the message
else {
    echo $responseArray['message'];
}