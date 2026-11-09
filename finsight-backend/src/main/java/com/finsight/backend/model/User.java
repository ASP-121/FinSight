package com.finsight.backend.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@NoArgsConstructor
@Document(collection = "users")
public class User
{

    @Id
    private String id;
    private String name;
    private String email;
    private String passwordHash;
}
