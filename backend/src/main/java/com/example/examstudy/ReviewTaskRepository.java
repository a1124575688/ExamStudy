package com.example.examstudy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewTaskRepository extends JpaRepository<ReviewTask, Long> {

    List<ReviewTask> findByStatus(String status);

    List<ReviewTask> findByStudyItemId(Long studyItemId);

}
