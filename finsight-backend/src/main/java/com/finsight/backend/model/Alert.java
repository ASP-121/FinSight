
package com.finsight.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "alerts")
public class Alert {

    @Id
    private String id;

    private String userId;
    private String type;
    private String severity;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDate date;
    private boolean read;
    private String actionText;
    private String actionRoute;
    private String sourceKey;
    private boolean dismissed;
}
