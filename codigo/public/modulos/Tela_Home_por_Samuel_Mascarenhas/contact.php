<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtém o corpo da requisição
    $data = json_decode(file_get_contents("php://input"));

    // Verifica se os dados foram recebidos corretamente
    if (isset($data->name) && isset($data->email) && isset($data->subject) && isset($data->message)) {
        $name = htmlspecialchars($data->name);
        $email = htmlspecialchars($data->email);
        $subject = htmlspecialchars($data->subject);
        $message = htmlspecialchars($data->message);

        // Envia o email
        $to = "solidarize@gmail.com";
        $headers = "From: $email" . "\r\n" . "Reply-To: $email";
        
        if (mail($to, $subject, $message, $headers)) {
            echo json_encode(["status" => "success", "message" => "Mensagem enviada com sucesso!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erro ao enviar a mensagem."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Dados inválidos."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Método não permitido."]);
}
?>
