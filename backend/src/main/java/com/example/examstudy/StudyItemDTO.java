package com.example.examstudy;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class StudyItemDTO {

    private String id;
    private String content;
    private String studyDate;
    private String tag;
    private String createdAt;

    public StudyItemDTO() {
    }

    public StudyItemDTO(String id, String content, String studyDate, String tag, String createdAt) {
        this.id = id;
        this.content = content;
        this.studyDate = studyDate;
        this.tag = tag;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getStudyDate() {
        return studyDate;
    }

    public void setStudyDate(String studyDate) {
        this.studyDate = studyDate;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public static StudyItemDTO fromEntity(StudyItem entity) {
        if (entity == null) {
            return null;
        }
        String createdAtString = null;
        if (entity.getCreatedAt() != null) {
            createdAtString = entity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        return new StudyItemDTO(
                entity.getId() != null ? entity.getId().toString() : null,
                entity.getContent(),
                entity.getStudyDate(),
                entity.getTag(),
                createdAtString
        );
    }

    public StudyItem toEntity() {
        StudyItem entity = new StudyItem();
        if (this.id != null && !this.id.isBlank()) {
            entity.setId(Long.parseLong(this.id));
        }
        entity.setContent(this.content);
        entity.setStudyDate(this.studyDate);
        entity.setTag(this.tag);
        if (this.createdAt != null && !this.createdAt.isBlank()) {
            entity.setCreatedAt(LocalDateTime.parse(this.createdAt, DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
        return entity;
    }

}
