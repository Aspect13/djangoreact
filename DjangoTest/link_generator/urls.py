from django.urls import path, include
# from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token

from link_generator.api_viewsets import ProjectViewSet, LinkPackViewSet
from . import views

router = DefaultRouter()
# router.register(r'projects/(?P<pid>[^/.]+)/linkpacks', LinkPackViewSet, base_name='linkpacks')
# router.register(r'linkpacks', LinkPackViewSet, base_name='linkpacks')
# router.register(r'projects/:project_id/linkpacks/', LinkPackViewSet, base_name='linkpacks')
router.register(r'projects', ProjectViewSet)
# router.register(r'qqq', LinkSetViewSet, base_name='qqq')
# router.register(r'users', UserViewSet)


linkpack_router = NestedDefaultRouter(router, r'projects', lookup='project')
linkpack_router.register(r'linkpacks', LinkPackViewSet, base_name='project-linkpacks')

# linkset_router = NestedDefaultRouter(linkpack_router, r'linkpacks', lookup='linkpack')
# linkset_router.register(r'linkset', LinkSetViewSet, base_name='project-linkpacks-linkset')



urlpatterns = [
	path('', views.index, name='index'),
	path('api/', include(router.urls)),
	path('api/', include(linkpack_router.urls)),
	# path('api/', include(linkset_router.urls)),
	path('api-token-auth/', obtain_jwt_token),
	path('api-token-verify/', verify_jwt_token),
]
