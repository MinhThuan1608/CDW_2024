package com.fit.monopolysbapi.monopolysocketapi.util;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Base64;

@Component
public class ImageUtil {

    public final String ImageFolderURL = "src/main/resource/static/default_avatar/";

    public String ImageToBase64(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);
        if (file.length()>=1048576) throw new RuntimeException("Image must be less than 1MB!");
        byte[] imageData = new byte[(int) file.length()];
        fis.read(imageData);
        fis.close();
        return Base64.getEncoder().encodeToString(imageData);
    }

}