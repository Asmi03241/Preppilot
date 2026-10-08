package com.preppilot.app.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class DocumentExtractionService {

    private static final long MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

    /**
     * Extracts readable text content from an uploaded document (TXT, PDF, or DOCX).
     *
     * @param file The uploaded multipart file
     * @return Extracted plain text content
     * @throws IllegalArgumentException if validation fails
     * @throws IOException if reading the file fails
     */
    public String extractText(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file was uploaded or the file is empty. Please select a valid document.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds the 25 MB limit. Please upload a smaller document.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        String extractedText;

        switch (extension.toLowerCase()) {
            case "txt":
                extractedText = extractFromTxt(file);
                break;
            case "pdf":
                extractedText = extractFromPdf(file);
                break;
            case "docx":
                extractedText = extractFromDocx(file);
                break;
            default:
                throw new IllegalArgumentException("Unsupported file type '." + extension + "'. Supported formats are: PDF, DOCX, and TXT.");
        }

        if (extractedText == null || extractedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Could not extract any readable text from '" + originalFilename + "'. Please make sure the file contains selectable text.");
        }

        return extractedText.trim();
    }

    private String extractFromTxt(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        return new String(bytes, StandardCharsets.UTF_8);
    }

    private String extractFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            if (document.isEncrypted()) {
                throw new IllegalArgumentException("The uploaded PDF is password-protected. Please remove the password and try again.");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new IOException("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }

    private String extractFromDocx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XWPFDocument doc = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        } catch (Exception e) {
            throw new IOException("Failed to extract text from DOCX document: " + e.getMessage(), e);
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
