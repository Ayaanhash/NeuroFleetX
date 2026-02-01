package com.neurofleetx.dto;

import java.util.List;

public class RouteResponse {

    private List<String> path;
    private int totalCost;

    public RouteResponse() {}

    public RouteResponse(List<String> path, int totalCost) {
        this.path = path;
        this.totalCost = totalCost;
    }

    public List<String> getPath() {
        return path;
    }

    public void setPath(List<String> path) {
        this.path = path;
    }

    public int getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(int totalCost) {
        this.totalCost = totalCost;
    }
}
