package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {
    private final ActivityLogRepository logs;
    private final UserRepository users;
    private final DoctorRepository doctors;
    private final PatientRepository patients;

    public ActivityLogService(ActivityLogRepository logs, UserRepository users, DoctorRepository doctors, PatientRepository patients){
        this.logs=logs; this.users=users; this.doctors=doctors; this.patients=patients;
    }

    public ActivityLog log(Authentication auth, Long patientId, String module, String action, String details){
        ActivityLog l=new ActivityLog();
        l.setPatientId(patientId);
        String email=auth==null?null:auth.getName();
        String role="SYSTEM";
        String name=email==null?"System":email;
        Long id=null;
        if(email!=null){
            var u=users.findByEmail(email).orElse(null);
            if(u!=null){
                id=u.getId();
                role=u.getRole().name();
                name = (u.getFullName() == null || u.getFullName().isBlank()) ? u.getEmail() : u.getFullName();
            }
            else {
                var d=doctors.findByEmail(email).orElse(null);
                if(d!=null){
                    id=d.getId();
                    role="DOCTOR";
                    name=d.getFullName();
                }
                else {
                    var p=patients.findByEmail(email).orElse(null);
                    if(p!=null){
                        id=p.getId();
                        role="PATIENT";
                        name=p.getPatientName();
                    }
                }
            }
        }
        l.setActorId(id);
        l.setActorRole(role);
        l.setActorName(name);
        l.setModule(module);
        l.setAction(action);
        l.setDetails(details);
        return logs.save(l);
    }

    public ActivityLog systemLog(Long patientId,String module,String action,String details){

        ActivityLog l=new ActivityLog();
        l.setPatientId(patientId);
        l.setActorRole("SYSTEM");
        l.setActorName("System");
        l.setModule(module);
        l.setAction(action);
        l.setDetails(details);
        return logs.save(l);
    }
}
