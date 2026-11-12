package com.medcare.inventory.service;

import com.medcare.inventory.model.Category;
import com.medcare.inventory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/** Creates the 7 default categories the first time the app starts. */
@Component
@RequiredArgsConstructor
public class CategorySeeder implements ApplicationRunner {

    private final CategoryRepository repo;

    @Override
    public void run(ApplicationArguments args) {
        if (repo.count() > 0) return;
        List.of("ICU Equipment", "Operation Theatre", "Laboratory Equipment", "Diagnostic Equipment",
                        "Patient-care Equipment", "Emergency Equipment", "General Hospital Equipment")
                .forEach(name -> {
                    Category c = new Category();
                    c.setName(name);
                    repo.save(c);
                });
    }
}
