package controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import beans.*;
import dto.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.IOException;

import static spark.Spark.get;
import static spark.Spark.put;

import java.util.Date;

import services.UserService;

public class UserController {
	private Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
	
	public UserController(UserService userService) {
		
		get("/rest/getAll", (req,res) -> {
			res.type("application/json");

			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				return gson.toJson(userService.getAll());
				}catch (Exception e) {
					e.printStackTrace();
					return "";
				}
			}
			return "No user logged in.";
		});
		
		get("/rest/getSuspicious", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				return gson.toJson(userService.getSuspicious());
				}catch (Exception e) {
					e.printStackTrace();
					return "";
				}
			}
			return "No user logged in.";
		});
		
		put("/user/updateUser/:id", (req, res) -> {
			res.type("application/json");
			UpdateUserDTO updatedProfile = gson.fromJson(req.body(), UpdateUserDTO.class);
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(loggedInUser.getAccountType().equals(AccountType.buyer)) {
				    	Buyer buyer = (Buyer) loggedInUser;
				    	return gson.toJson(userService.updateBuyer(buyer, updatedProfile));
				    }else if(loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	Administrator admin = (Administrator) loggedInUser;
				    	return gson.toJson(userService.updateAdministrator(admin, updatedProfile));
				    }else if(loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	Manager manager = (Manager) loggedInUser;
				    	return gson.toJson(userService.updateManager(manager, updatedProfile));
				    }if(loggedInUser.getAccountType().equals(AccountType.deliveryWorker)) {
				    	DeliveryWorker deliveryWorker = (DeliveryWorker) loggedInUser;
				    	return gson.toJson(userService.updateDeliveryWorker(deliveryWorker, updatedProfile));
				    }
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});	
		
		put("/rest/updatePersonalInfo/:id", (req, res) -> {
			res.type("application/json");
			UpdatePersonalInfoDTO updatedPersonalInfo = gson.fromJson(req.body(), UpdatePersonalInfoDTO.class);
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
				    res.status(200);
					return gson.toJson(userService.updatePersonalInfo(loggedInUser, updatedPersonalInfo));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					e.printStackTrace();
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
			
		});
		
		put("/rest/blockUser/:id", (req, res) -> {
			res.type("application/json");
			userService.blockUser(req.params("id"));
			res.status(200);
			return "";
		});	
		
		put("/rest/unblockUser/:id", (req, res) -> {
			res.type("application/json");
			userService.unblockUser(req.params("id"));
			res.status(200);
			return "";
		});	
		
		get("/rest/availableManagers", (req,res) -> {
			res.type("application/json");
			return gson.toJson(userService.getAvailableManagers());
		});
		
		put("rest/uploadProfileImage/:id", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getID().equals(req.params("id"))) {
		                res.status(401);
		                return "Forbidden action!";
		            }
		            UpdateImageDTO updateImageDTO = gson.fromJson(req.body(), UpdateImageDTO.class);
		            res.status(200);
		            return gson.toJson(userService.updateProfileImage(user, updateImageDTO.getImage()));
		        } catch (Exception e) {
		            e.printStackTrace();
		            res.status(401);
		            return "You must log in to continue.";
		        }
		    }
		    res.status(401);
		    return "Please log in to continue.";
		});
		
		put("rest/changePassword/:id", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getID().equals(req.params("id"))) {
		                res.status(401);
		                return "Forbidden action!";
		            }
		            if(userService.updateUserPassword(user, gson.fromJson(req.body(), PasswordChangeDTO.class))) {
		            	res.status(200);
		            	return "Successfuly changed password!";
		            };
		            res.status(400);
	            	return "Wrong password attempt, enter your valid current password!";
		            
		        } catch (Exception e) {
		            e.printStackTrace();
		            res.status(401);
		            return "You must log in to continue.";
		        }
		    }
		    res.status(401);
		    return "Please log in to continue.";
		});
		
		put("rest/updateUsername/:id", (req, res) -> {
		    res.type("text/plain");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getID().equals(req.params("id"))) {
		                res.status(401);
		                return "Forbidden action!";
		            }
		            if(userService.updateUsername(req.body(), user)) {
		            	res.status(200);
		            	String newJWT = Jwts.builder().setSubject(req.body()).setExpiration(new Date(new Date().getTime() + 1000*86400L)).setIssuedAt(new Date()).signWith(LoginController.key).compact();
						user.setJWTToken(jwt);
						return newJWT;
		            }
		            res.status(405);
	            	return "Someone with that username already exists!";
	            	
		        } catch (Exception e) {
		            e.printStackTrace();
		            res.status(401);
		            return "You must log in to continue.";
		        }
		    }
		    res.status(401);
		    return "Please log in to continue.";
		});

		put("/rest/deleteUser/:id", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
					
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "Forbidden access!";
				    }
				    userService.deleteUser(req.params("id"));
					res.status(200);
					return gson.toJson("");
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
	}
	
}
