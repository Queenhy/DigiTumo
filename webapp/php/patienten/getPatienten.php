<?php
	include_once '../db.php';
	
	// Abfrage der gewünschten Informationen zu allen Patienten
	$sql = "SELECT patientId, vorname, nachname, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, bezeichnung AS tumor, stadium AS tumorstadium FROM patient JOIN krankenakte ON (patient.patientId = krankenakte.patient_patientId) JOIN krankheiten ON (krankenakte.krankenakteId = krankheiten.krankenakte_krankenakteId) JOIN krankheitsverlauf ON (krankenakte.krankenakteId = krankheitsverlauf.krankenakte_krankenakteId) WHERE tumor = '0'";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"patienten": ' . $result . '}';
	echo $str;
?>