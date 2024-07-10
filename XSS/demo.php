<!-- //sudo apt update
//sudo apt upgrade

//sudo apt install apache2
//sudo apt install php libapache2-mod-php

//sudo systemctl start apache2
//sudo systemctl enable apache2


//php -v

//XSS Reflejado
//sudo nano /var/www/html/index.php

//XSS Almacenado
//sudo nano /var/www/html/store.php

//En index.php
//Sin aplicación de control -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Demo de XSS Almacenado</title>
</head>
<body>
    <h1>Comentario</h1>
    <form method="POST" action="store.php">
        <textarea name="comment"></textarea>
        <button type="submit">Enviar</button>
    </form>
    <div id="comments">
        <?php
        if (file_exists('comments.txt')) {
            echo file_get_contents('comments.txt');
        }
        ?>
    </div>
</body>
</html>

<?php
if (isset($_POST['comment'])) {
    file_put_contents('comments.txt', $_POST['comment'] . "<br>", FILE_APPEND);
    header("Location: store.php");
    exit();
}
?>

//Con la aplicación del control
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demostración de XSS Reflejado</title>
</head>
<body>
    <h1>Buscar</h1>
    <form method="GET" action="">
        <label for="query">Buscar:</label>
        <input type="text" id="query" name="query">
        <button type="submit">Enviar</button>
    </form>

    <?php
    if (isset($_GET['query'])) {
        // Obtener el parámetro de la URL
        $query = $_GET['query'];

        // Escapar los caracteres especiales para prevenir XSS
        $escaped_query = htmlspecialchars($query, ENT_QUOTES, 'UTF-8');

        // Mostrar el resultado
        echo "<p>Resultados de búsqueda para: " . $escaped_query . "</p>";
    }
    ?>
</body>
</html>

//En store.php
//Sin aplicación del control
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Demo de XSS Almacenado</title>
</head>
<body>
    <h1>Comentario</h1>
    <form method="POST" action="store.php">
        <textarea name="comment"></textarea>
        <button type="submit">Enviar</button>
    </form>
    <div id="comments">
        <?php
        if (file_exists('comments.txt')) {
            echo file_get_contents('comments.txt');
        }
        ?>
    </div>
</body>
</html>

<?php
if (isset($_POST['comment'])) {
    file_put_contents('comments.txt', $_POST['comment'] . "<br>", FILE_APPEND);
    header("Location: store.php");
    exit();
}
?>


//Con la aplicacion del control
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demostración de XSS Almacenado</title>
</head>
<body>
    <h1>Dejar un Comentario</h1>
    <form method="POST" action="">
        <label for="comment">Comentario:</label>
        <textarea id="comment" name="comment" rows="4" cols="50"></textarea>
        <button type="submit">Enviar</button>
    </form>

    <?php
    // Conexión a la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "xss_demo";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['comment'])) {
        // Obtener el comentario y escapar los caracteres especiales
        $comment = $_POST['comment'];
        $sanitized_comment = htmlspecialchars($comment, ENT_QUOTES, 'UTF-8');

        // Insertar el comentario saneado en la base de datos
        $stmt = $conn->prepare("INSERT INTO comments (comment) VALUES (?)");
        $stmt->bind_param("s", $sanitized_comment);
        $stmt->execute();
        $stmt->close();
    }

    // Recuperar y mostrar los comentarios
    $result = $conn->query("SELECT comment FROM comments");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Escapar los caracteres especiales antes de mostrar los comentarios
            echo "<p>" . htmlspecialchars($row['comment'], ENT_QUOTES, 'UTF-8') . "</p>";
        }
    } else {
        echo "<p>No hay comentarios.</p>";
    }

    $conn->close();
    ?>
</body>
</html>