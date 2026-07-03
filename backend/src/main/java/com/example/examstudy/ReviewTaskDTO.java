package com.example.examstudy;

public class ReviewTaskDTO {

    private String id;
    private String studyItemId;
    private String reviewDate;
    private Integer interval;
    private String status;
    private String completedAt;

    public ReviewTaskDTO() {
    }

    public ReviewTaskDTO(String id, String studyItemId, String reviewDate, Integer interval, String status, String completedAt) {
        this.id = id;
        this.studyItemId = studyItemId;
        this.reviewDate = reviewDate;
        this.interval = interval;
        this.status = status;
        this.completedAt = completedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudyItemId() {
        return studyItemId;
    }

    public void setStudyItemId(String studyItemId) {
        this.studyItemId = studyItemId;
    }

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Integer getInterval() {
        return interval;
    }

    public void setInterval(Integer interval) {
        this.interval = interval;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public static ReviewTaskDTO fromEntity(ReviewTask entity) {
        if (entity == null) {
            return null;
        }
        String studyItemIdString = null;
        if (entity.getStudyItem() != null && entity.getStudyItem().getId() != null) {
            studyItemIdString = entity.getStudyItem().getId().toString();
        }
        return new ReviewTaskDTO(
                entity.getId() != null ? entity.getId().toString() : null,
                studyItemIdString,
                entity.getReviewDate(),
                entity.getInterval(),
                entity.getStatus(),
                entity.getCompletedAt()
        );
    }

}
