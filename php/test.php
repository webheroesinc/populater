<?php
require __DIR__ . '/populater.php';

function fill($str, $data) {
    return populater($str, $data);
}
function test($assert, $message) {
    // echo $message . "\n";
    assert($assert);
}

echo __convert__("first.name[\"some.this\"] first.name['som\'e.this'][0]") . "\n";

$Person	= json_decode( file_get_contents('../person.json') );

$str	= fill("{name.first} {name.last}", $Person);
echo json_encode($str) . "\n";
// test($str === "Travis", $str);

$str	= fill("{name.first} {name['middle'][0]} {name.last}", $Person);
echo json_encode($str) . "\n";

$str	= fill("< name.first", $Person);
echo json_encode($str) . "\n";

function testFillFunc($name) {
    return "Geoff " . $name;
}

$str	= fill("= testFillFunc(\$this->name->first)", $Person);
echo json_encode($str) . "\n";

$str	= fill(":= {name.middle[0]}", $Person);
echo json_encode($str) . "\n";

echo "\n";
?>