package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.CreateUserRequestDTO;
import com.example.potla_medicore_backend.Entity.User;
import com.example.potla_medicore_backend.Service.UserService;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins="http://localhost:3000")
public class UserController {

 private final UserService userService;
 private final ActivityLogService activityLogService;

 public UserController(UserService userService, ActivityLogService activityLogService){
  this.userService=userService; this.activityLogService=activityLogService;
 }


 @PostMapping
 public ResponseEntity<?> createUser(@RequestBody CreateUserRequestDTO request,Authentication authentication){
  try{
   User u=userService.createUser(request,authentication);
   activityLogService.log(authentication,null,"ADMIN","STAFF_CREATED","Administrator created staff account: " + u.getEmail());
   return ResponseEntity.ok(Map.of("message","Account created","id",u.getId(),"email",u.getEmail(),"role",u.getRole().name()));
  }
  catch(RuntimeException e){
   return ResponseEntity.badRequest().body(Map.of("success",false,"message",e.getMessage()));}
 }
 @GetMapping
 public ResponseEntity<List<StaffUserDTO>> getAllStaff(){
  return ResponseEntity.ok(userService.getAllStaff().stream().map(u->new StaffUserDTO(u.getId(),u.getFullName(),u.getPhoneNumber(),u.getEmail(),u.getRole().name(),u.isMainAdmin())).toList());
 }

 public record StaffUserDTO(Long id,String fullName,String phoneNumber,String email,String role,boolean mainAdmin){}

 @GetMapping("/me")
 public ResponseEntity<?> getMyProfile(Authentication authentication){
  try {
   if(authentication == null || !authentication.isAuthenticated()) return ResponseEntity.status(401).body(Map.of("message","Please login first"));
   return ResponseEntity.ok(userService.getByEmail(authentication.getName()));
  } catch(RuntimeException e){ return ResponseEntity.status(404).body(Map.of("message",e.getMessage())); }
 }

 @PutMapping("/me")
 public ResponseEntity<?> updateMyProfile(@RequestBody StaffProfileUpdateRequest request, Authentication authentication){
  try {
   if(authentication == null || !authentication.isAuthenticated()) return ResponseEntity.status(401).body(Map.of("message","Please login first"));
   User user=userService.updateMyProfile(authentication.getName(),request);
   activityLogService.log(authentication,null,"STAFF_PROFILE","PROFILE_UPDATED","Staff member updated their profile");
   String token=userService.generateTokenForUser(user);
   return ResponseEntity.ok(Map.of("message","Profile updated successfully","token",token,"user",user,"email",user.getEmail(),"id",user.getId(),"role",user.getRole().name()));
  } catch(RuntimeException e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
 }

 public record StaffProfileUpdateRequest(String fullName,String phoneNumber,String email,String password){}
}
