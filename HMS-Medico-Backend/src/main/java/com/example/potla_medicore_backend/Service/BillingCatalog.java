package com.example.potla_medicore_backend.Service;

import java.util.List;
import java.util.Locale;

/** Demo hospital price list. Replace these sample amounts with approved facility prices before live use. */
public final class BillingCatalog {
    private BillingCatalog() {}

    public record CatalogItem(String name, long pricePaise) {}

    public static final List<CatalogItem> LAB_TESTS = List.of(
            new CatalogItem("Complete Blood Count (CBC)", 40000),
            new CatalogItem("Blood Glucose", 15000),
            new CatalogItem("HbA1c", 50000),
            new CatalogItem("Lipid Profile", 70000),
            new CatalogItem("Thyroid Profile", 65000),
            new CatalogItem("Liver Function Test", 90000),
            new CatalogItem("Kidney Function Test", 80000),
            new CatalogItem("Urine Routine", 25000),
            new CatalogItem("ECG", 50000),
            new CatalogItem("Chest X-Ray", 80000),
            new CatalogItem("Vitamin D (25-OH)", 120000),
            new CatalogItem("Vitamin B12", 90000),
            new CatalogItem("Serum Creatinine", 30000),
            new CatalogItem("Electrolyte Panel", 60000),
            new CatalogItem("CRP (C-Reactive Protein)", 70000)
    );

    public static final List<CatalogItem> MEDICINES = List.of(
            new CatalogItem("Paracetamol 500 mg (strip)", 3000),
            new CatalogItem("Cetirizine 10 mg (strip)", 2500),
            new CatalogItem("Pantoprazole 40 mg (strip)", 5000),
            new CatalogItem("ORS Sachet", 2000),
            new CatalogItem("Amoxicillin 500 mg (strip)", 12000),
            new CatalogItem("Ibuprofen 400 mg (strip)", 4000),
            new CatalogItem("Azithromycin 500 mg (strip)", 15000),
            new CatalogItem("Metformin 500 mg (strip)", 5000),
            new CatalogItem("Amlodipine 5 mg (strip)", 4000),
            new CatalogItem("Vitamin D3 60,000 IU (capsule)", 8000)
    );

    public static final List<CatalogItem> HEALTH_CHECKUPS = List.of(
            new CatalogItem("Basic Health Checkup", 99900),
            new CatalogItem("Full Body Checkup", 249900),
            new CatalogItem("Heart Health Checkup", 179900),
            new CatalogItem("Diabetes Screening", 79900)
    );

    public static boolean supportsHomeVisit(String packageName) {
        return "Basic Health Checkup".equalsIgnoreCase(packageName == null ? "" : packageName.trim())
                || "Full Body Checkup".equalsIgnoreCase(packageName == null ? "" : packageName.trim());
    }

    public static CatalogItem find(List<CatalogItem> catalog, String name) {
        if (name == null) return null;
        String normalized = name.trim().toLowerCase(Locale.ROOT);
        return catalog.stream().filter(item -> item.name().toLowerCase(Locale.ROOT).equals(normalized))
                .findFirst().orElse(null);
    }
}
