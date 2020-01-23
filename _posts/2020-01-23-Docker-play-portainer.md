---
title: Do you know Docker Play and Portainer ?
date: 2020-01-23 05:00:00 +0000
description: We will see about the usage of Docker play and Portainer
tags:
- DockerPlay
- Portainer.io
image: "/assets/doc0.png"

---
The Play with Docker brings you labs that help you get hands-on experience using Docker. In this docker play you will find a mix of labs and tutorials that will help Docker users, including SysAdmins, IT Pros, and Developers. There is a mix of hands-on tutorials right in the browser, instructions on setting up and using Docker in your own environment, and resources about best practices for developing and deploying your own applications.

## Template

We have template option where we can create setup of manager and workers virtual machines.
![](/assets/doc2.PNG)

## Timing

We have 4hrs of timing to use our Virtual machines for labs
![](/assets/doc3.PNG)

## Labs

Stop playing with PubG, Start to play with docker ;)
[https://labs.play-with-docker.com/](https://labs.play-with-docker.com/)
![](/assets/doc1.PNG)

## Portainer.io

Portainer is a simple management solution for Docker. It consists of a web UI that allows you to easily manage your Docker containers, images, networks and volumes.

It is a user-interface of Docker management, i should create a sepearte post for portainer, In this blog i will quote some basics.


## How simple is it to deploy Portainer?

Portainer installation using Docker

Portainer is comprised of two elements, the Portainer Server, and the Portainer Agent. Both elements run as lightweight Docker containers on a Docker engine or within a Swarm cluster. Due to the nature of Docker, there are many possible deployment scenarios, however, we have detailed the most common below. Please use the scenario that matches your configuration (or if your configuration is not listed, see portainer.readthedocs.io for additional options).

Note that the recommended deployment mode when using Swarm is using the Portainer Agent.
Deploy Portainer Server on a standalone LINUX Docker host/single node swarm cluster (or Windows 10 Docker Host running in “Linux containers” mode).

Use the following Docker commands to deploy the Portainer Server; note the agent is not needed on standalone hosts, however it does provide additional functionality if used (see portainer and agent scenario below):

![](/assets/doc4.jpg)
![](/assets/doc5.png)


> $ docker volume create portainer_data
$ docker run -d -p 8000:8000 -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
You'll just need to access the port 9000 of the Docker engine where portainer is running using your browser.

> Note: the -v /var/run/docker.sock:/var/run/docker.sock option can be used in Linux environments only.

Deploy Portainer Server on a standalone WINDOWS Docker Host (running Windows Containers) – note must be Windows 1803 or newer.

> $ docker volume create portainer_data
$ docker run -d -p 8000:8000 -p 9000:9000 --name portainer --restart always -v \\.\pipe\docker_engine:\\.\pipe\docker_engine -v portainer_data:C:\data portainer/portainer


You'll just need to access the port 9000 of the Docker engine where portainer is running using your browser.

> Note: the -v \\.\pipe\docker_engine:\\.\pipe\docker_engine option can be used in Windows 1803+ Container environments only.

## PORTAINER AGENT DEPLOYMENTS ONLY

Deploy Portainer Agent on a remote LINUX Swarm Cluster as a Swarm Service, run this command on a manger node in the remote cluster.

> $ docker service create --name portainer_agent --network portainer_agent_network --publish mode=host,target=9001,published=9001 -e AGENT_CLUSTER_ADDR=tasks.portainer_agent --mode global --mount type=bind,src=//var/run/docker.sock,dst=/var/run/docker.sock --mount type=bind,src=//var/lib/docker/volumes,dst=/var/lib/docker/volumes –-mount type=bind,src=/,dst=/host portainer/agent

Deploy Portainer Agent on a standalone Windows Server 2016 Docker Host

> $ docker run -d -p 9001:9001 --name portainer_agent --restart=always -v \\.\pipe\docker_engine:\\.\pipe\docker_engine portainer/agent

## And more deployment scenarios

[To see how to use our Edge compute agent, see the user guides here](https://downloads.portainer.io/edge_agent_guide.pdf)

[For a list of our most frequently asked questions, please see here](https://portainer.readthedocs.io/en/stable/faq.html)

[Have a look at our installation documentation for more deployment scenarios such as Portainer with data persistence, TLS authentication enabled engine, non-Docker setup or reverse proxy integrations.](https://portainer.readthedocs.io/en/stable/deployment.html)


