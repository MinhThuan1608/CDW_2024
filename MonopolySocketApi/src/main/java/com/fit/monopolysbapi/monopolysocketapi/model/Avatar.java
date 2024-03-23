package com.fit.monopolysbapi.monopolysocketapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "avatars")
public class Avatar {
    @Id
    private String id;
    private String data;
    private Date createAt;
    private boolean isActive;
    private boolean isDefaultAvatar;
}
