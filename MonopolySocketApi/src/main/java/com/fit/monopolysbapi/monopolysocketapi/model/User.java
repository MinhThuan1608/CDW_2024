package com.fit.monopolysbapi.monopolysocketapi.model;

import com.fit.monopolysbapi.monopolysocketapi.response.UserResponse;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    private String id;
    private String email;
    private String username;
    private String password;
    @ManyToOne
    private Avatar avatar;
    @Column(nullable = false)
    private long money = 0;
    private boolean isConfirmEmail;
    private boolean isNonLocked;
    @Column(nullable = false, columnDefinition = "bigint default 1000")
    private long exp;
    private Date lastLoginDate;
    private Date createDate;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) role = Role.USER;
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public UserResponse getUserResponse() {
        return UserResponse.builder()
                .id(getId())
                .email(getEmail())
                .username(getUsername())
                .avatar(getAvatar())
                .money(getMoney())
                .isNonLocked(isNonLocked())
                .isConfirmEmail(isConfirmEmail())
                .exp(getExp())
                .build();
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", avatar='" + avatar + '\'' +
                ", isConfirmEmail=" + isConfirmEmail +
                ", isNonLocked=" + isNonLocked +
                ", role=" + role +
                '}';
    }
}