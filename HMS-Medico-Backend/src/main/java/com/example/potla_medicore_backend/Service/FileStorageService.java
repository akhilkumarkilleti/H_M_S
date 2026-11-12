package com.example.potla_medicore_backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDirectory = Paths.get("uploads");

    public FileStorageService() throws IOException {
        Files.createDirectories(uploadDirectory);
    }

    public String saveFile(MultipartFile file) throws IOException {

        return saveFile(file, "");
    }

    public String saveFile(MultipartFile file, String folder) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        Path directory = uploadDirectory;

        if (folder != null && !folder.isBlank()) {
            directory = uploadDirectory.resolve(folder);
        }

        Files.createDirectories(directory);
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = directory.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
