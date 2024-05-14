package com.fit.monopolysbapi.monopolysocketapi.repository;

import com.fit.monopolysbapi.monopolysocketapi.model.Statistic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Long> {

    List<Statistic> getByLogDateBetween(Date from, Date to);


}
