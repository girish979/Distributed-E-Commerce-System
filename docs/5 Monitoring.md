To set up Grafana and Prometheus together as part of a monitoring stack, you’ll need to:

1.	Deploy Prometheus to collect and store metrics.
2.	Deploy Grafana to visualize these metrics.
3.	Integrate Grafana with Prometheus to create dashboards and alerts.

Step 1: Update Docker Compose to Include Prometheus and Grafana

Here’s how to add Prometheus and Grafana services to your existing Docker Compose file:

Updated Docker Compose

```
services:
  # Prometheus service
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus:/etc/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - '9090:9090'
    networks:
      - cockroachnet

  # Grafana service
  grafana:
    image: grafana/grafana-oss:latest
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
    ports:
      - '3000:3000'
    networks:
      - cockroachnet
    depends_on:
      - prometheus

networks:
  cockroachnet:
    driver: bridge
```
Step 2: Configure Prometheus to Scrape Metrics

You need a Prometheus configuration file to define which targets to scrape metrics from.

Create the Prometheus Configuration File

Create a file named prometheus.yml inside a folder called prometheus in your project directory.

`prometheus/prometheus.yml`
```
global:
  scrape_interval: 15s  # Scrape every 15 seconds

scrape_configs:
  - job_name: 'kafka'
    static_configs:
      - targets: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-node1:6379', 'redis-node2:6380', 'redis-node3:6381', 'redis-node4:6382', 'redis-node5:6383', 'redis-node6:6384']

  - job_name: 'cockroachdb'
    static_configs:
      - targets: ['cockroachdb1:8080', 'cockroachdb2:8081', 'cockroachdb3:8082']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
```
Explanation

	•	scrape_interval: 15s: Prometheus will scrape metrics from the defined targets every 15 seconds.
	•	job_name: Specifies the target job name (e.g., Kafka, Redis, CockroachDB).
	•	static_configs: Lists the targets for Prometheus to scrape metrics from.

Step 3: Start the Docker Containers


Step 4: Access Grafana and Add Prometheus as a Data Source

	1.	Open Grafana in your browser:
	•	Navigate to http://localhost:3000.
	•	Log in with the default credentials:
	•	Username: admin
	•	Password: admin
	2.	Add Prometheus as a Data Source:
	•	Go to Configuration (gear icon) > Data Sources > Add Data Source.
	•	Select Prometheus as the data source.
	•	Set the URL to http://prometheus:9090 (matching the Docker service name and port).
	•	Click Save & Test to confirm the connection.

Step 5: Create Dashboards in Grafana

	1.	Go to the Dashboards section in Grafana and click + New Dashboard.
	2.	Click Add Query, select the Prometheus data source, and use PromQL to query metrics.

Example PromQL Queries

•	Kafka Metrics:

```
sum(rate(kafka_server_brokertopicmetrics_messagesin_total[5m])) by (broker)
```

•	This query shows the rate of messages produced per broker.

•	Redis Metrics:

```
redis_memory_used_bytes{job="redis"}
```

•	This shows the memory used by Redis nodes.

•	CockroachDB Metrics:

```
rate(cockroach_queries_per_second[5m])
```

•	This shows the rate of queries processed by CockroachDB over 5 minutes.

