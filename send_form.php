<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données du formulaire
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Valider les données
    if (!empty($name) && !empty($email) && !empty($message) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Destinataire et sujet de l'email
        $to = "info@yadelagadou.com"; // Remplacez par votre adresse email
        $subject = "Nouveau message de contact de $name";

        // Contenu de l'email
        $emailContent = "Nom: $name\n";
        $emailContent .= "Email: $email\n\n";
        $emailContent .= "Message:\n$message\n";

        // En-têtes de l'email
        $headers = "From: $name <$email>";

        // Envoyer l'email
        if (mail($to, $subject, $emailContent, $headers)) {
            echo "Merci! Votre message a été envoyé.";
        } else {
            echo "Erreur! Votre message n'a pas pu être envoyé.";
        }
    } else {
        echo "Veuillez remplir tous les champs et fournir une adresse email valide.";
    }
} else {
    echo "Méthode de requête invalide.";
}
?>
