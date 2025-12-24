package com.neurofleetx.algorithm;

import com.neurofleetx.model.*;

import java.util.*;

public class DijkstraAlgorithm {

    public static Map<Node, Integer> findShortestPath(Graph graph, Node source) {
        Map<Node, Integer> distance = new HashMap<>();
        PriorityQueue<Node> pq = new PriorityQueue<>(
            Comparator.comparingInt(distance::get)
        );

        for (Node node : graph.getAdjList().keySet()) {
            distance.put(node, Integer.MAX_VALUE);
        }

        distance.put(source, 0);
        pq.add(source);

        while (!pq.isEmpty()) {
            Node current = pq.poll();

            for (Edge edge : graph.getAdjList().get(current)) {
                int newDist = distance.get(current) + edge.getWeight();

                if (newDist < distance.get(edge.getTo())) {
                    distance.put(edge.getTo(), newDist);
                    pq.add(edge.getTo());
                }
            }
        }

        return distance;
    }
}
