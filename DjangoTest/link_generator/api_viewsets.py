# ViewSets define the view behavior.
from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from link_generator.models import Project, LinkPack
from link_generator.serializers import ProjectSerializer, LinkPackSerializer


class ProjectViewSet(viewsets.ModelViewSet):
	queryset = Project.objects.all()
	serializer_class = ProjectSerializer
	lookup_field = 'name'

	def perform_create(self, serializer):
		serializer.save(created_by=self.request.user)

	# @detail_route(methods=['get'])
	# def linkpacks(self, request, name=None):
	# 	print('detail_route', request, name)
	# 	parent_project = self.get_object()
	# 	print('detail_route owner', parent_project.id)
	# 	linkpacks = LinkPack.objects.filter(project=parent_project)
	# 	context = {
	# 		'request': request
	# 	}
	# 	linkpack_serializer = LinkPackSerializer(linkpacks, many=True, context=context)
	# 	return Response(linkpack_serializer.data)




class LinkPackViewSet(viewsets.ModelViewSet):
	# queryset = LinkPack.objects.all()
	serializer_class = LinkPackSerializer
	# lookup_field = 'created_by'

	# lookup_field = 'id'

	def get_queryset(self):
		print('QQQQQQ')
		return LinkPack.objects.filter(project__name=self.kwargs['project_name'])

	def perform_create(self, serializer):
		# todo: validate self.request
		print(self.request.data)
		serializer.save(created_by=self.request.user)

	@detail_route(methods=['GET'])
	def get_file(self, request, *args, **kwargs):
		from django.http import HttpResponse
		qs = LinkPack.objects.filter(pk=self.kwargs['pk']).first()

		response = HttpResponse(qs.to_file(), content_type='text/plain')
		response['Content-Disposition'] = 'attachment; filename="{project_name}_{panel}_links.txt"'.format(
			project_name=qs.project.name,
			panel=qs.panel
		)
		return response

		# print(self.request.data)
		# print(dir(self.request))
		# base_url = self.request.data['base_url']
		# panel = self.request.data['panel']
		# extra_params = self.request.data['extra_params']
		# link_amount = int(self.request.data['link_amount'])
		#
		# for i in range(link_amount):
		#
		# 	link_set = LinkSet()
		# 	if base_url:
		# 		link_set.base_url = base_url
		# 	link_set.package_id = obj.id
		# 	link_set.panel = panel
		# 	link_set.extra_params = extra_params
		# 	link_set.save()
		# 	print('lsd', link_set.id)



	# 	print('aaaaaaaaa', self.request.data)
	# 	return self.queryset.filter(project__name=self.request.query_params.get('qqq', None))
	# def get_queryset(self):
	# 		# print('aaaaaaaaa', self.request.pid)
	# 		import re
	# 		print(re.search(r'projects/(?P<pid>[^/.]+)/linkpacks/', self.request.path))
	# 		print('aaaaaaaaa', self.request.query_params)
	# 		# return LinkPack.objects.filter(project__name=self.request.query_params.get('qqq', None))
	# 		return LinkPack.objects.all()


# class LinkSetViewSet(viewsets.ModelViewSet):
# 	serializer_class = LinkSetSerializer
# 	# queryset = LinkSet.objects.all()
#
# 	def get_queryset(self):
# 		print('KWARGS', self.kwargs)
# 		return LinkSet.objects.filter(package_id=self.kwargs['linkpack_pk'])




# class UserViewSet(viewsets.ModelViewSet):
# 	queryset = User.objects.all().order_by('id')
# 	serializer_class = UserSerializer

	# def get_permissions(self):
	# 	"""
	# 	Instantiates and returns the list of permissions that this view requires.
	# 	"""
	# 	if self.action == 'list':
	# 		permission_classes = [IsAuthenticated]
	# 	else:
	# 		permission_classes = [IsAdminUser]
	# 	return [permission() for permission in permission_classes]


