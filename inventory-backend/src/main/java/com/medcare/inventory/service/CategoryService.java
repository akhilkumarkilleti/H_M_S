package com.medcare.inventory.service;

import com.medcare.inventory.dto.CategoryRequest;
import com.medcare.inventory.dto.CategoryResponse;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.Category;
import com.medcare.inventory.repository.CategoryRepository;
import com.medcare.inventory.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;
    private final EquipmentRepository equipment;

    public List<CategoryResponse> list(boolean activeOnly) {
        return repo.findAllByOrderByNameAsc().stream()
                .filter(c -> !activeOnly || c.isActive())
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest r) {
        String name = r.name().trim();
        if (repo.existsByNameIgnoreCase(name))
            throw new ApiException(HttpStatus.CONFLICT, "Category \"" + name + "\" already exists.");
        Category c = new Category();
        c.setName(name);
        c.setDescription(clean(r.description()));
        c.setActive(r.active() == null || r.active());
        return toResponse(repo.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest r) {
        Category c = find(id);
        String name = r.name().trim();
        if (repo.existsByNameIgnoreCaseAndIdNot(name, id))
            throw new ApiException(HttpStatus.CONFLICT, "Category \"" + name + "\" already exists.");

        String oldName = c.getName();
        c.setName(name);
        c.setDescription(clean(r.description()));
        if (r.active() != null) c.setActive(r.active());

        // equipment stores the category name, so keep those rows in sync
        if (!oldName.equals(name)) equipment.renameCategory(oldName, name);
        return toResponse(c);
    }

    @Transactional
    public void delete(Long id) {
        Category c = find(id);
        long used = equipment.countByCategory(c.getName());
        if (used > 0)
            throw new ApiException(HttpStatus.CONFLICT,
                    "Cannot delete: " + used + " equipment item(s) use this category. Deactivate it instead.");
        repo.delete(c);
    }

    private Category find(Long id) {
        return repo.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found."));
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription(), c.isActive(),
                equipment.countByCategory(c.getName()));
    }

    private static String clean(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }
}
