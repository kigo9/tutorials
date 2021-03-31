# Stories app

Stories app is a simple REST API server that persists stories. The server is running inside a [Docker](dockerid) container orchestrated by [Kubernetes](k8sid) with help of [Minikube](minikubeid) local cluster. The application example is taken from Udemy course [Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/) (Section 13-223). The course covers basic usage of [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/). The cluster uses resource files in order to configure such Kubernetes Objects as Pod, Deployment, Service, PersistentVolume, PersistentVolumeClaim, ConfigMap.

## Prerequisites

- [Docker Desktop](dockerDownloadId)
- [Minikube](minikubedownloadid)
- [Kubectl](kubectldownloadid)
- [VirtualBox](virtualboxdownloadid)

## Usage

Build an Image and upload it to your personal [Docker Hub](dockerhubid) repository

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
kubectl apply -f=service.yaml,deployment.yaml,host-pv.yaml,host-pvc.yaml,environment.yaml
```

Expose cluster running Service to external IP

```
minikube service <your-service-name>
```

Now REST API should be available via external IP address provided by command above

[dockerhubid]: https://hub.docker.com/
[dockerid]: https://www.docker.com/
[k8sid]: https://kubernetes.io/
[minikubeid]: https://minikube.sigs.k8s.io/docs/
[dockerdownloadid]: https://www.docker.com/products/docker-desktop
[minikubedownloadid]: https://minikube.sigs.k8s.io/docs/start/
[virtualboxdownloadid]: https://www.virtualbox.org/wiki/Downloads
[kubectldownloadid]: https://kubernetes.io/docs/tasks/tools/
