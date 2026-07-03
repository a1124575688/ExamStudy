package com.example.examstudy;

import jakarta.persistence.*;

@Entity
@Table(name = "review_tasks")
public class ReviewTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_item_id", nullable = false)
    private StudyItem studyItem;

    @Column(nullable = false)
    private Integer interval;

    @Column(name = "review_date", nullable = false, length = 50)
    private String reviewDate;

    @Column(nullable = false, length = 20)
    private String status = "pending";

    @Column(name = "completed_at", length = 50)
    private String completedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudyItem getStudyItem() {
        return studyItem;
    }

    public void setStudyItem(StudyItem studyItem) {
        this.studyItem = studyItem;
    }

    public Integer getInterval() {
        return interval;
    }

    public void setInterval(Integer interval) {
        this.interval = interval;
    }

    public String getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(String reviewDate) {
        this.reviewDate = reviewDate;
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

}
