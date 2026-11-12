package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.ActivityLog;
import com.example.potla_medicore_backend.Repository.ActivityLogRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activity")
@CrossOrigin(origins="http://localhost:3000")
public class ActivityLogController {

    private final ActivityLogRepository logs;
    public ActivityLogController(ActivityLogRepository logs){this.logs=logs;}

    @GetMapping
    public List<ActivityLog> all(){
        return logs.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/patient/{patientId}")
    public List<ActivityLog> patient(@PathVariable Long patientId){
        return logs.findByPatientIdOrderByCreatedAtDesc(patientId);
    }
}
