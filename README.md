# Nodejs Express Application


## Deploying with Source-to-Image (S2I)
Change the default port in `bin/www` to 8080.

```
# Copy Login Command
$ oc login <cluster_url> --token=<token>

$ oc new-project s2i-npx-app-ns
$ oc project s2i-npx-app-ns
$ docker pull registry.access.redhat.com/ubi8/nodejs-10
$ s2i build https://github.com/remkohdev/ngx-app.git registry.access.redhat.com/ubi8/nodejs-10 s2i-npx-app
$ oc new-app --name s2i-npx-app registry.access.redhat.com/ubi8/nodejs-10~https://github.com/remkohdev/ngx-app.git --strategy=source --allow-missing-images 
$ oc expose svc/s2i-npx-app
$ oc status
$ oc logs -f bc/s2i-npx-app
$ oc delete all -l app=s2i-npx-app
```

## Add a new Operator

The Operator SDK provides the following workflow to develop a new Operator:

The following workflow is for a new Go operator:

1. Create a new operator project using the SDK Command Line Interface(CLI)
1. Define new resource APIs by adding Custom Resource Definitions(CRD)
1. Define Controllers to watch and reconcile resources
2. Write the reconciling logic for your Controller using the SDK and controller-runtime APIs
3. Use the SDK CLI to build and generate the operator deployment manifests

```
$ operator-sdk new ngx-app-operator --repo github.com/remkohdev/ngx-app
$ cd ngx-app-operator
$ operator-sdk add api --api-version=ngx-app.remkoh.dev/v1alpha1 --kind=AppService
$ operator-sdk add controller --api-version=ngx-app.remkoh.dev/v1alpha1 --kind=AppService
$ export USERNAME=remkohdev
$ operator-sdk build docker.io/$USERNAME/ngx-app-operator
$ docker login docker.io
$ docker push docker.io/$USERNAME/ngx-app-operator
$ sed -i "" "s|REPLACE_IMAGE|docker.io/$USERNAME/ngx-app-operator|g" deploy/operator.yaml

$ oc login <cluster_url> --token=<token>

$ kubectl create -f deploy/service_account.yaml
$ kubectl create -f deploy/role.yaml
$ kubectl create -f deploy/role_binding.yaml
$ kubectl create -f deploy/crds/ngx-app.remkoh.dev_appservices_crd.yaml
$ kubectl create -f deploy/operator.yaml

$ kubectl create -f deploy/crds/ngx-app.remkoh.dev_v1alpha1_appservice_cr.yaml
$ kubectl get pod -l app=my-ngxappservice
$ kubectl describe appservice my-ngxappservice
```