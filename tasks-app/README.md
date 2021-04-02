# Tasks app

Tasks app is a simple web application which helps to create and display tasks. The application example is taken from Udemy course [Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/) (Section 14-239). Main focus of the course is networking inside the Cluster. Communication between Containers inside one Pod running in the same Worker Node, communication between Containers inside Pods running in different Worker Nodes, communication with Service intended to communicate only inside the Cluster and Cluster external communication.

## Prerequisites

- [Docker Desktop](dockerDownloadId)
- [Minikube](minikubedownloadid)
- [Kubectl](kubectldownloadid)
- [VirtualBox](virtualboxdownloadid)

## Usage

Build Images for each of auth-api, tasks-api, users-api, frontend services and upload them to your personal [Docker Hub](dockerhubid) repository

```
docker build -t <your-docker-hub-name>/<your-docker-hub-repository-name> .
docker push <your-docker-hub-name>/<your-docker-hub-repository-name>
```

Run Minikube Kubernetes cluster with VirtualBox as a driver

```
minikube start --driver=virtualbox
```

Apply Kubernetes resource files to cluster

```
kubectl apply -f=auth-service.yaml,auth-deployment.yaml,frontend-service.yaml,frontend-deployment.yaml,tasks-service.yaml,tasks-deployment.yaml,users-service.yaml,users-deployment.yaml
```

Expose cluster running frontend Service to external IP

```
minikube service frontend-service
```

Now frontend should be available via external IP address provided by command above and ready for communication with REST API
