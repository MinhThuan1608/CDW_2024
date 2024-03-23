package com.fit.monopolysbapi.monopolysocketapi.service;

import com.fit.monopolysbapi.monopolysocketapi.model.Avatar;
import com.fit.monopolysbapi.monopolysocketapi.repository.AvatarRepository;
import com.fit.monopolysbapi.monopolysocketapi.util.ImageUtil;
import com.fit.monopolysbapi.monopolysocketapi.util.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvatarService {
    private final ImageUtil imageUtil;
    private final Util util;
    private final AvatarRepository avatarRepository;

    public boolean isImageDefaultExist(String id){
        return avatarRepository.existsById(id);
    }

    public Avatar getAvatarById(String id){
        return avatarRepository.findAvatarById(id);
    }

    public Avatar addAvatar(String data){
        String id = util.generateId();
        while (avatarRepository.existsById(id)) id = util.generateId();
        Avatar avatar =  Avatar.builder()
                .id(id).data(data).createAt(new Date()).isActive(true).isDefaultAvatar(false).build();
        return avatarRepository.save(avatar);
    }

    public List<Avatar> getDefaultAvatars(){
        return avatarRepository.findAvatarsByDefaultAvatar(true);
    }


    public static void main(String[] args) throws IOException {
        String path = "src/main/resources/static/1.png";
        File file = new File(path);
        System.out.println(file.length());
        FileInputStream fileInputStream = new FileInputStream(file);

        // Đọc dữ liệu từ file hình ảnh
        byte[] imageData = new byte[(int) file.length()];
        fileInputStream.read(imageData);
        fileInputStream.close();

        // Mã hóa dữ liệu thành chuỗi base64
        String base64Image = Base64.getEncoder().encodeToString(imageData);

        System.out.println(base64Image);
        System.out.println(base64Image.length());
    }
}

