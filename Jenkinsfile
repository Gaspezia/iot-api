pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'nexus'
        DOCKER_REGISTRY_HUB = '192.168.1.70:8082'
        DOCKER_REGISTRY_PRIVATE = '192.168.1.70:8083'
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Build Docker Image') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    def dockerTag = (env.BRANCH_NAME == 'main') ? 'latest' : 'dev'
                    def dockerImage = "${DOCKER_REGISTRY_PRIVATE}/smart-building-iot-api:${dockerTag}"

                    echo "===============> Authenticating to Docker Hub ..."
                    docker.withRegistry("https://${DOCKER_REGISTRY_HUB}", DOCKER_HUB_CREDENTIALS) {
                        echo "===============> Building Docker image ${dockerImage} ..."
                        docker.build(dockerImage)
                    }
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            when {
                expression { 
                    return env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'
                }
            }
            steps {
                script {
                    def dockerTag = (env.BRANCH_NAME == 'main') ? 'latest' : 'dev'
                    def dockerImage = "${DOCKER_REGISTRY_PRIVATE}/smart-building-iot-api:${dockerTag}"

                    echo "===============> Pushing Docker image ${dockerImage} to Nexus ..."
                    docker.withRegistry("https://${DOCKER_REGISTRY_PRIVATE}", DOCKER_HUB_CREDENTIALS) {
                        docker.image(dockerImage).push()
                    }
                }
            }
        }

        stage('Clean up Docker') {
            steps {
                script {
                    def dockerTag = (env.BRANCH_NAME == 'main') ? 'latest' : 'dev'
                    def dockerImage = "${DOCKER_REGISTRY_PRIVATE}/smart-building-iot-api:${dockerTag}"

                    // Supprime les images Docker non taguées
                    sh 'docker image prune -f'

                    // Supprime l'image Docker créée
                    echo "===============> Removing Docker image ${dockerImage} ..."
                    sh "docker rmi ${dockerImage} || true"

                    // Vide le cache du builder Docker
                    echo "===============> Pruning Docker builder cache ..."
                    sh 'docker builder prune -f'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}