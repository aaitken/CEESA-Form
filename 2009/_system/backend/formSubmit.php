<title>Untitled Document</title><?php
						
			
			// Prepare the Body 
			$message = '<html><body>';
			$message .= "<span style='font-weight:bold;'>CEESA Conference Registration Form</span>";
			
			// School Information
			$message .= '<table border="0" cellspacing="5" style="margin-bottom:30px;">';
			$message .= "<tr style='background: #888; color:#fff; text-align:left;'><th colspan='2'>School Information</th></tr>";
			
			$message .= "<tr><td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; display:block; padding:2px 6px 5px;' margin-top:5px;><span>School Name</span> </td><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step0_school']) . "</span></td></tr>";
			
			$message .= "<tr><td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; display:block; padding:2px 6px 5px;' margin-top:5px;><span>School Contact Person</span> </td><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step0_contact']) . "</span></td></tr>";
			
			$message .= "<tr><td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; display:block; padding:2px 6px 5px;' margin-top:5px;><span>School Contact Email</span> </td><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step0_email']) . "</span></td></tr>";			
			
			$message .= "<tr><td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; display:block; padding:2px 6px 5px;' margin-top:5px;><span>Member School</span> </td><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step0_member_YN']) . "</span></td></tr>";
			$message .= "</table>";
						
			
			// Conference Attendess
			$message .= '<table border="0" cellspacing="5" style="margin-bottom:30px;">';
			$message .= "<tr style='background: #888; color:#fff; text-align:left;'><th colspan='5'>Conference Attendess</th></tr>";
			
			
			
			$message .= "<tr><td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Atendees Name</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Atendees Email</span></td>";		
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Presenting</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>AC/AD</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Printout</span></td>";
			
			$message .= "</tr>";
			
			for ($i=0; $i < 100; $i++) {	
					
				if ($_POST['step1_name'.$i] != "") {
				
				$message .= "<tr><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_name'.$i]) . "</span></td>";
	
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_email'.$i]) . "</span></td>";
	
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_presenting_DD'.$i]) . "</span></td>";
				
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_acad_yn'.$i]) . "</span></td>";
	
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_program_yn'.$i]) . "</span></td>";
				
				$message .= "</tr>";
				
				}
			}
			
			$message .= "</table>";
			
			
			// Pre-Conferences & Institutes
			$message .= '<table border="0" cellspacing="5" style="margin-bottom:30px;">';
			$message .= "<tr style='background: #888; color:#fff; text-align:left;'><th colspan='5'>Pre-Conferences & Institutes</th></tr>";
			
			
			
			$message .= "<tr><td style='background:#ffffff none repeat scroll 0 0; border:1px solid #ffffff; padding:2px 6px 5px;'><span>&nbsp;</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Wednesday</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Thursday</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Friday</span></td>";
			
			$message .= "<td style='background:#E5E5E5 none repeat scroll 0 0; border:1px solid #D9D9D9; padding:2px 6px 5px;'><span>Saturday</span></td>";
			
			$message .= "</tr>";
			
			for ($i=0; $i < 100; $i++) {	
					
				if ($_POST['step1_name'.$i] != "") {
				
				$message .= "<tr><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step1_name'.$i]) . "</span></td>";
			
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step2_wednesday'.$i]) . "</span></td>";
				
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step2_thursday'.$i]) . "</span></td>";
				
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step2_friday'.$i]) . "</span></td>";
				
				$message .= "<td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['step2_saturday'.$i]) . "</span></td>";
				
				$message .= "</tr>";
				
				}
			}
			
			$message .= "</table>";
			
			// Cost
			$message .= '<table border="0" cellspacing="5" style="margin-bottom:30px;">';
			$message .= "<tr style='background: #000; color:#fff; text-align:left;'><th colspan='1'>Cost</th></tr>";
			
			$message .= "<tr><td style='padding:2px 6px 5px; vertical-align:middle; border:none;'><span>" . strip_tags($_POST['cost']) . "</span></td>";
				
			$message .= "</tr>";
			
			
			$message .= "</table>";
			
			$message .= "</body></html>";
			
			
             
            // Send Email   
			//$to = 'haddnin@gmail.com';
			$to = 'haddnin@gmail.com, aitken.alexander@gmail.com';
			
			$subject =  strip_tags($_POST['step0_school']) . " Conference Registration Form";
			
			$headers = "From: " . "info@mapping.com" . "\r\n";
			$headers .= "MIME-Version: 1.0\r\n";
			$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

            if (mail($to, $subject, $message, $headers)) {
             echo '<div style="background-color:#ffa; padding:20px">' . $_POST['successMessage'] . '</div>';
			 
				} else {
			 echo '<div style="background-color:#ffa; padding:20px">' . $_POST['errorMessage'] . '</div>';
            }
            

?>
