package com.neurofleetx.backend.algorithm;

import com.neurofleetx.backend.graph.Graph;
import com.neurofleetx.backend.graph.Node;

import java.util.*;

public class DijkstraAlgorithm {

    public static Map<Node, Integer> findShortestPath(Graph graph, Node start) {
        Map<Node, Integer> distances = new HashMap<>();
        Set<Node> visited = new HashSet<>();

        for (Node node : graph.getNodes()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(start, 0);

        while (visited.size() < graph.getNodes().size()) {
            Node current = getClosestUnvisited(distances, visited);
            if (current == null) break;

            visited.add(current);

            for (Map.Entry<Node, Integer> neighbor : graph.getEdges(current).entrySet()) {
                if (visited.contains(neighbor.getKey())) continue;

                int newDist = distances.get(current) + neighbor.getValue();
                if (newDist < distances.get(neighbor.getKey())) {
                    distances.put(neighbor.getKey(), newDist);
                }
            }
        }

        return distances;
    }

    private static Node getClosestUnvisited(Map<Node, Integer> distances, Set<Node> visited) {
        Node closest = null;
        int min = Integer.MAX_VALUE;

        for (Map.Entry<Node, Integer> entry : distances.entrySet()) {
            if (!visited.contains(entry.getKey()) && entry.getValue() < min) {
                min = entry.getValue();
                closest = entry.getKey();
            }
        }
        return closest;
    }
}
