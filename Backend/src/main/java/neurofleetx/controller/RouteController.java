package com.neurofleetx.controller;

import com.neurofleetx.model.Node;
import com.neurofleetx.service.RouteOptimizationService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    private final RouteOptimizationService service;

    public RouteController(RouteOptimizationService service) {
        this.service = service;
    }

    @GetMapping("/optimize")
    public Map<Node, Integer> optimizeRoute(
            @RequestParam String startNode) {

        Node start = new Node(startNode);
        return service.optimizeRoute(start);
    }
}
