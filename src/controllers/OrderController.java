package controllers;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import beans.AccountType;
import beans.Buyer;
import beans.Cart;
import beans.DeliveryRequest;
import beans.Manager;
import beans.Order;
import beans.User;
import dto.CreateNewOrderDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.IOException;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import services.OrderService;
import services.UserService;

public class OrderController {
	private static Gson gson = new Gson();
	
	public OrderController(OrderService orderService, UserService userService) {
		
		get("/orders/getByRestaurant/:id", (req,res) -> {
			res.type("application/json");
			return gson.toJson(orderService.getOrdersByRestaurantId(Integer.parseInt(req.params("id"))));
		});
		
		post("rest/createOrder",(req,res)->{
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    CreateNewOrderDTO createNewOrderDTO = gson.fromJson(req.body(), CreateNewOrderDTO.class);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(createNewOrderDTO.getBuyerId())) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					orderService.createOrder(createNewOrderDTO);
					return "Order successfully created.";
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
		
		get("rest/orders/:id",(req,res)->{
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden content!";
				    }
				    res.status(200);
				    return gson.toJson(orderService.getOrdersForUser(buyer.getID()));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
		});
		
		get("rest/restaurantOrders",(req,res)->{
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Manager manager = (Manager)userService.getById(claims.getBody().getSubject());
				    if(manager == null) {
				    	res.status(404);
				    	return "Bad request!";
				    }
				    res.status(200);
				    return gson.toJson(orderService.getOrdersForRestaurant(manager.getRestaurant()));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
		});
		
		get("rest/buyerType/:id", (req, res)->{
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					return gson.toJson(orderService.getBuyerType(req.params("id")));
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
		
		get("rest/discount/:id", (req, res)->{
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					return gson.toJson(orderService.getDiscount(req.params("id")));
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
		
		put("rest/cancelOrder/:id", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Order updatedOrder = gson.fromJson(req.body(), Order.class);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(updatedOrder.getBuyer())) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					return gson.toJson(orderService.cancelOrder(updatedOrder));
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
		
		get("rest/orderStats/:id", (req, res)->{
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
					res.status(200);
					return gson.toJson(orderService.getOrderStats(user));
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
		
		put("rest/markForDelivery/:id",(req,res)->{
			res.type("application/json");
			/*String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden content!";
				    }*/
				    res.status(200);
				    return gson.toJson(orderService.markForDelivery(req.params("id")));
			/*	} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";*/
		});
		
		put("rest/setInPreparation/:id",(req,res)->{
			res.type("application/json");
			res.status(200);
			return gson.toJson(orderService.setInPreparation(req.params("id")));
		});
		
		get("rest/deliveryOrders/:id", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            // ako nije bacio izuzetak, onda je OK
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getID().equals(req.params("id"))) {
		                res.status(401);
		                return "Forbidden action";
		            }
		            return gson.toJson(orderService.getOrdersForDeliveryWorker(user));
		        } catch (Exception e) {
		            e.printStackTrace();
		            return "Session invalid.";
		        }
		    }
		    return "You must login to continue.";
		});
		
		post("rest/pickupDelivery/:id", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getID().equals(req.body())) {
		                res.status(401);
		                return "Forbidden action!";
		            }
		            res.status(200);
		            orderService.pickupDelivery(user.getID(), req.params("id"));
		            return "Order marked for pickup";
		        }catch(JsonSyntaxException | IOException e) {
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
		
		get("rest/deliveryRequests", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            // ako nije bacio izuzetak, onda je OK
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getAccountType().equals(AccountType.manager)) {
		                res.status(401);
		                return "Forbidden action";
		            }
		            Manager manager = (Manager)user;
		            res.status(200);
		            return gson.toJson(orderService.getDeliveryRequests(manager));
		        } catch (Exception e) {
		            e.printStackTrace();
		            return "Session invalid.";
		        }
		    }
		    return "You must login to continue.";
		});
		
		put("rest/approveRequest", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            // ako nije bacio izuzetak, onda je OK
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getAccountType().equals(AccountType.manager)) {
		                res.status(401);
		                return "Forbidden action";
		            }
		            res.status(200);
		            orderService.approveRequest(gson.fromJson(req.body(), DeliveryRequest.class));
		            return "Request approved";
		        } catch (Exception e) {
		            e.printStackTrace();
		            return "Session invalid.";
		        }
		    }
		    return "You must login to continue.";
		});
		
		put("rest/declineRequest", (req, res) -> {
		    res.type("application/json");
		    String auth = req.headers("Authorization");
		    if ((auth != null) && (auth.contains("Bearer "))) {
		        String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
		        try {
		            Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
		            // ako nije bacio izuzetak, onda je OK
		            User user = userService.getById(claims.getBody().getSubject());
		            if(!user.getAccountType().equals(AccountType.manager)) {
		                res.status(401);
		                return "Forbidden action";
		            }
		            res.status(200);
		            orderService.declineRequest(gson.fromJson(req.body(), DeliveryRequest.class));
		            return "Request approved";
		        } catch (Exception e) {
		            e.printStackTrace();
		            return "Session invalid.";
		        }
		    }
		    return "You must login to continue.";
		});
	}
}
