sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {
			
			// Auslagern des AJAX-Call als eigene Funktion
			loadData: function() {
				$.ajax({
					url: "php/admin/getRollen.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().byId("Benutzerrolle").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
					}
				});
				var anzahlUser;
				$.ajax({
					url: "php/admin/getAnzahlUser.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						anzahlUser = response;
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
					} 
				});
				$.ajax({																									// Aufruf eines AJAX-Calls
					url: "php/admin/getUser.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
						$.ajax({
							url: "php/admin/getUserrollen.php",
							type: "GET",
							context: this,
							success: function handleSuccess(response) {
								var oModel = new JSONModel();
								oModel.setJSON(response);
								var id = "Benutzerrolle-" + this.getView().getId() + "--BenutzerTab-";
								for(var i = 0; i < anzahlUser; i++) {
									id = id.substring(0, 38) + i;
									this.getView().byId(id).setSelectedKey(Object.values(Object.values(oModel.getData())[i])[1]);
									this.getView().byId(id).setValue(Object.values(Object.values(oModel.getData())[i])[1]);
								};
							},
							error: function handleError() {
								MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
							} 
						});
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
					}
				});
			},
			
			loadUserRollen: function() {
				
				
			},
			
			// Funktion wird beim ersten Aufruf des Views ausgeführt
			onInit: function() {
				this.loadData();																							// Aufruf der Funktion loadData
				sap.ui.getCore().attachParseError(																			// Dient der Eingabeüberprüfung und farblichen Gestaltung der Kästchen
					function(oEvent) {
						var oElement = oEvent.getParameter("value");
                        if (oElement.setValueState) {
                        	oElement.setValueState(sap.ui.core.ValueState.Error);
    						oElement.setShowValueStateMessage(false);
                        }
					}
				);
				sap.ui.getCore().attachValidationSuccess(
					function(oEvent) {
						var oElement = oEvent.getParameter("valid");
                        if (oElement.setValueState) {
                        	oElement.setValueState(sap.ui.core.ValueState.None);
                        }
					}
				);
			},
			
			// Funktion wird beim Klick auf den Button "addUser" ausgeführt
			onAddUser: function() {																						
				var oDialog = this.getView().byId("benutzerdialog");
				if (!oDialog) { 
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addUser", this);		// Aufruf des Fragments "addBenutzer"
					this.getView().addDependent(oDialog);
				};
				this.oDialog.open();																						// Öffnen des Dialogs
			},

			// Funktion wird beim Ändern des Datepicker "geburtsdatum" im Dialog "benutzerdialog" ausgeführt
			handleDateChange: function(oEvent) {
				var valid = oEvent.getParameter("valid");
				if (!valid) {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error" (rote Umrandung)
					this.getView().byId("geburtsdatum").setShowValueStateMessage(false);									
				}
				else {
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.None);							// Ändert den Status auf "None"
				};
			},
			
			// Funktion wird beim Klick auf den Button mit dem Diskettensymbol im Dialog "benutzerdialog" ausgeführt
			onSaveNeuerUser: function() {
				var vorname = this.getView().byId("vorname").getValue();													// Auslesen des Wertes "Vorname"
				var validVorname = true;																					// Variable "validVorname" initial falsch setzen
				if(vorname == "") {																							// Abfangen von leerer Eingabe
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);								// Ändert den Status auf "Error"
					this.getView().byId("vorname").setValueStateText("Bitte einen Vornamen eingeben.");														// Ausgabe einer Messagebox des Typs "Error"
					validVorname = false;
				}
				else if(vorname.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) == -1) {																// Abfangen von Sonderzeichen und Zahlen 
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);							// Ändert den Status auf "Error"
						this.getView().byId("vorname").setValueStateText("Der Vorname darf nur Buchstaben enthalten.");		// Ausgabe einer Messagebox des Typs "Error"
						validVorname = false;
				}
				else if(vorname.length > 40) {
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("vorname").setValueStateText("Der Vorname darf max. 40 Zeichen lang sein.");
					validVorname = false;
				}
				else {
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.None);							// Ändert den Status auf "None"
					vorname = vorname.trim();
					vorname = vorname[0].toUpperCase() + vorname.substring(1, vorname.length);
				};
					
				var nachname = this.getView().byId("nachname").getValue();												// Auslesen des Wertes "Vorname"
				var validNachname = true;																				// Variable "validNachname" initial falsch setzen
				if(nachname == "") {																					// Abfangen von leerer Eingabe
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error"
					this.getView().byId("nachname").setValueStateText("Bitte einen Nachnamen eingeben.");									
					validNachname = false;
				}
				else if(nachname.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) == -1) {															// Abfangen von Sonderzeichen und Zahlen
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
					this.getView().byId("nachname").setValueStateText("Der Nachname darf nur Buchstaben enthalten.");
					validNachname = false;
				}
				else if(nachname.length > 40) {
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("nachname").setValueStateText("Der Nachname darf max. 40 Zeichen lang sein.");
					validNachname = false;
				}
				else {
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.None);						// Ändert den Status auf "None"
					nachname = nachname.trim();
					nachname = nachname[0].toUpperCase() + nachname.substring(1, nachname.length);
				};

				var geburtsdatum = this.getView().byId("geburtsdatum").getValue();										// Auslesen des Wertes "geburtsdatum"
				var validGeburtsdatum = true;																			// Variable "validGeburtsdatum" initial falsch setzen
				if(geburtsdatum == "") {																				// Abfangen von leerer Eingabe
					this.getView().byId("geburtsdatum").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
					this.getView().byId("geburtsdatum").setValueStateText("Bitte ein Geburtsdatum eingeben.");
					validGeburtsdatum = false	
				}
				else {
					if(this.getView().byId("geburtsdatum").getValueState() == "Error") {								// Falls Status "None"
						this.getView().byId("geburtsdatum").setValueStateText("Bitte ein gültiges Geburtsdatum eingeben.");
						validGeburtsdatum = false;																		// Variable "validGeburtsdatum" auf wahr setzen
					};
				};
				
				var passwort = this.getView().byId("passwort").getValue();												// Auslesen des Wertes "passwort"	
				var validPasswort = true;																				// Variable "validPasswort" initial falsch setzen
				if(passwort.length < 8) {																				// Abfangen eines Passworts unter 8 Zeichen
					this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);						// Ändert den Status auf "Error"
					this.getView().byId("passwort").setValueStateText("Das Passwort muss aus min. acht Zeichen bestehen.");								// Ausgabe einer Messagebox des Typs "Error"
					validPasswort = false;
				} 
				else if(passwort.length > 30) {
					this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("passwort").setValueStateText("Das Passwort darf max. 30 Zeichen lang sein.");
					validPasswort = false;
				}
				else {
					var zahl = false;																					// Variable "zahl" initial falsch setzen
					for(var i = 0; i < passwort.length; i++) {															// Schleife mit Anzahl der Durchläufe gleich Länge des Passworts in einzelnen Buchtaben
						if(!isNaN(passwort[i])) {																		// isNaN --> is not a number
							zahl = true;																				// Variable "validGeburtsdatum" auf wahr setzen
						};
					};
					if(!zahl) {
						this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.Error);					// Ändert den Status auf "Error"
						this.getView().byId("passwort").setValueStateText("Das Passwort muss min. eine Zahl enthalten.");								// Ausgabe einer Messagebox des Typs "Error"
						validPasswort = false;
					}
					else {
						this.getView().byId("passwort").setValueState(sap.ui.core.ValueState.None);						// Ändert den Status auf "None"
					};
				};

				var berechtigungsstatus = this.getView().byId("berechtigungsstatus").getValue();						// Auslesen des Wertes "berechtigungsstatus"
				var validBerechtigungsstatus = true;																	// Variable "validBerechtigungsstatus" initial falsch setzen
				if(berechtigungsstatus == "") {																			// Abfangen von leerer Eingabe
					this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);				// Ändert den Status auf "Error"
					this.getView().byId("berechtigungsstatus").setValueStateText("Bitte einen Berechtigungsstatus auswählen.");										// Ausgabe einer Messagebox des Typs "Error"
					validBerechtigungsstatus = false;	
				}
				else if(berechtigungsstatus !== "Arzt" && berechtigungsstatus !== "Administrator" && berechtigungsstatus !== "Studienpflege") {			// Abfangen von unbekannter Eingabe
					this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.Error);				// Ändert den Status auf "Error"
					this.getView().byId("berechtigungsstatus").setValueStateText("Bitte einen gültigen Berechtigungsstatus auswählen.");							// Ausgabe einer Messagebox des Typs "Error"
					validBerechtigungsstatus = false;	
				}
				else {
					this.getView().byId("berechtigungsstatus").setValueState(sap.ui.core.ValueState.None);				// Ändert den Status auf "None"
				};
				
				if(validVorname && validNachname && validGeburtsdatum && validPasswort && validBerechtigungsstatus) {
					$.ajax({																								// Aufruf eines AJAX-Calls
						url: "php/admin/generateUserId.php",
						data: {
							"vorname": vorname,
							"nachname": nachname
						},
						type: "POST",
						context: this,
						success: function handleSuccess(userId) {
							$.ajax({
								url: "php/admin/setNeuenUser.php",
								data: {
									"vorname": vorname,
									"nachname": nachname,
									"geburtsdatum": geburtsdatum,
									"passwort": passwort,
									"berechtigungsstatus": berechtigungsstatus,
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess() {
									this.loadData();
									this.oDialog.destroy();
									this.oDialog.close();
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");									// Ausgabe einer Messagebox des Typs "Error"
								}
							});
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");											// Ausgabe einer Messagebox des Typs "Error"
						}
					});
				}
				else {
					MessageBox.error("Bitte die Eingaben überprüfen!");
				};
			},
			
			// Funktion wird beim Klick auf den Button mit dem roten X im Dialog "benutzerdialog" ausgeführt
			onCancelNeuerUser: function() {
				var pointer = this;
				if(
					this.getView().byId("vorname").getValue() != "" ||
					this.getView().byId("nachname").getValue() != "" ||
					this.getView().byId("geburtsdatum").getValue() != "" ||
					this.getView().byId("passwort").getValue() != "" ||
					this.getView().byId("berechtigungsstatus").getValue() != ""
				) {
					MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										
						onClose: function(sResult) {
							if(sResult == "YES") {																				
								pointer.oDialog.destroy();
								pointer.oDialog.close();
							};
						}
					});
				}
				else {
					this.oDialog.destroy();																						// Zerstören des Dialogs
					this.oDialog.close();																						// Schließen des Dialogs
				};
			},
				
			// Funktion wird beim Klick auf den Button "DeleteUser" ausgeführt
			onDeleteUser: function(oEvent) {
				var tmp = Object.values(oEvent.getParameters())[0];
				var id = tmp.substring(47, tmp.length);
				var userId = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[3];
				var pointer = this;
				MessageBox.confirm("Möchten Sie den Benutzer " + userId + " wirklich löschen?", {							// Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										// Definieren der Aktionen
					onClose: function(sResult) {
						if(sResult == "YES") {																				// Falls Aktion "YES"
							$.ajax({																						// Aufruf eines AJAX-Calls
								url: "php/admin/deleteUser.php",
								data: {
									"userId": userId
								},
								type: "POST",
								context: this,
								success: function handleSuccess(response) {
									if(response === "0") {
										MessageBox.error("Der einzige Administrator kann nicht gelöscht werden. Bitte erst einen weiteren Administrator erstellen, bevor Sie diesen Nutzer löschen.");
									}
									else {
										pointer.loadData();
									};
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");									// Ausgabe einer Messagebox des Typs "Error"
								}
							})
						};
					}
				});
			},
			
			onSave: function() {
				var id = new Array(5);
				id[0] = "Vorname-" + this.getView().getId() + "--BenutzerTab-";
				id[1] = "Nachname-" + this.getView().getId() + "--BenutzerTab-";
				id[2] = "Benutzerkennung-" + this.getView().getId() + "--BenutzerTab-";
				id[3] = "Passwort-" + this.getView().getId() + "--BenutzerTab-";
				id[4] = "Benutzerrolle-" + this.getView().getId() + "--BenutzerTab-";
				var userListe = new Array();
				var i = 0;
				while(this.getView().byId(id[0]+i) != undefined) {
					userListe[i] = new Array(id.length);
					for(var j = 0; j < userListe[i].length; j++) {
						userListe[i][j] = this.getView().byId(id[j]+i).getValue();
					};
					i++;
				};
				
				var validVorname = true;
				var validNachname = true;
				var validPasswort = true;
				var validBenutzerrolle = true;
				var id = this.getView().getId() + "--BenutzerTab-";
				for(var i = 0; i < userListe.length; i++) {
					var id = id.substring(0, 24) + i;
					if(userListe[i][0] == "") {
						this.getView().byId("Vorname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-"+id).setValueStateText("Bitte einen Vornamen eingeben.");
						validVorname = false;
					} 
					else if(userListe[i][0].search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) == -1) {
						this.getView().byId("Vorname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-"+id).setValueStateText("Der Vorname darf nur Buchstaben enthalten.");
						validVorname = false;
					}
					else if(userListe[i][0].length > 40) {
						this.getView().byId("Vorname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Vorname-"+id).setValueStateText("Der Vorname darf max. 40 Zeichen lang sein.");
						validVorname = false;
					}
					else {
						this.getView().byId("Vorname-"+id).setValueState(sap.ui.core.ValueState.None);
						userListe[i][0] = userListe[i][0].trim();
						userListe[i][0] = userListe[i][0][0].toUpperCase() + userListe[i][0].substring(1, userListe[i][0].length);
					};
					
					if(userListe[i][1] == "") {
						this.getView().byId("Nachname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-"+id).setValueStateText("Bitte einen Nachnamen eingeben.");
						validNachname = false;
					}
					else if(userListe[i][1].search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) == -1) {
						this.getView().byId("Nachname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-"+id).setValueStateText("Der Nachname darf nur Buchstaben enthalten.");
						validNachname = false;
					}
					else if(userListe[i][1].length > 40) {
						this.getView().byId("Nachname-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Nachname-"+id).setValueStateText("Der Nachname darf max. 40 Zeichen lang sein.");
						validNachname = false;
					}
					else {
						userListe[i][1] = userListe[i][1].trim();
						userListe[i][1] = userListe[i][1][0].toUpperCase() + userListe[i][1].substring(1, userListe[i][1].length);
						this.getView().byId("Nachname-"+id).setValueState(sap.ui.core.ValueState.None);
					};
					
					if(userListe[i][3].length < 8) {
						this.getView().byId("Passwort-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Passwort-"+id).setValueStateText("Das Passwort muss aus min. acht Zeichen bestehen.");
						validPasswort = false;
					}
					else if(userListe[i][3].length > 30) {
						this.getView().byId("Passwort-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Passwort-"+id).setValueStateText("Das Passwort darf max. 30 Zeichen lang sein.");
						validPasswort = false;
					}
					else {
						var zahl = false;																					
						for(var j = 0; j < userListe[i][3].length; j++) {															
							if(!isNaN(userListe[i][3][j])) {																		
								zahl = true;																				
							};
						};
						if(!zahl) {
							this.getView().byId("Passwort-"+id).setValueState(sap.ui.core.ValueState.Error);					
							this.getView().byId("Passwort-"+id).setValueStateText("Das Passwort muss min. eine Zahl enthalten.");	
							validPasswort = false;
						}
						else {
							this.getView().byId("Passwort-"+id).setValueState(sap.ui.core.ValueState.None);						
						};
					};
					
					if(userListe[i][4] == "") {
						this.getView().byId("Benutzerrolle-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Benutzerrolle-"+id).setValueStateText("Bitte einen Berechtigungsstatus auswählen.");
						validBenutzerrolle = false;
					}
					else if(userListe[i][4] != "Arzt" && userListe[i][4] != "Administrator" && userListe[i][4] != "Studienpflege") {
						this.getView().byId("Benutzerrolle-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Benutzerrolle-"+id).setValueStateText("Bitte einen gültigen Berechtigungsstatus auswählen.");
						this.getView().byId("Benutzerrolle-"+id).setValue("");
						validBenutzerrolle = false;
					}
					else {
						this.getView().byId("Benutzerrolle-"+id).setValueState(sap.ui.core.ValueState.None);
					};
				};
				
				if(validVorname && validNachname && validPasswort && validBenutzerrolle) {
					$.ajax({																									// Aufruf eines AJAX-Calls
						url: "php/admin/updateUser.php",
						data: {
							"userListe": userListe
						},
						type: "POST",
						context: this,
						success: function handleSuccess(response) {
							if(response === "0") {
								MessageBox.error("Die Rolle des einzigen Administrators kann nicht geändert werden. Bitte erst einen weiteren Administrator erstellen, bevor Sie die Rolle dieses Nutzers ändern.");
							}
							else {
								MessageBox.success("Speichern erfolgreich.");														// Ausgabe einer Messagebox des Typs "Success"
							};
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");												// Ausgabe einer Messagebox des Typs "Error"
						}
					});
				}
				else {
					MessageBox.error("Bitte die Eingaben überprüfen!");
				};
			},
			
			// Funktion wird beim Klick auf den Button "cancel" ausgeführt
			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										// Ausgabe einer Messagebox des Typs "Confirm"
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										// Definieren der Aktionen
					onClose: function(sResult) {
						if(sResult == "YES") {																				// Falls Aktion "YES"
							pointer.loadData();																				// Aufruf der Funktion loadData
						};
					}
				});
			},
			
			// Funktion wird beim Klick auf den Button "logout" ausgeführt
			onLogout: function() {		
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich wirklich abmelden? Nicht gespeicherte Änderungen gehen verloren.", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult == "YES") {
							pointer.getOwnerComponent().getTargets().display("login");							
						}
					}
				});
			},
			
		});
	});