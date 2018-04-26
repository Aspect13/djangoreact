# ViewSets define the view behavior.
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from link_generator.models import Project, LinkPack
from link_generator.serializers import ProjectSerializer, LinkPackSerializer, ChangePasswordSerializer


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

	# def create(self, request, *args, **kwargs):
	# 	# data = {
	# 	# 	**request.data,
	# 	# 	'project': Project.objects.filter(name=self.kwargs['project_name']).first().id,
	# 	# }
	# 	data = request.data
	# 	print('create!!!!', data)
	#
	# 	serializer = self.get_serializer(data=data,)
	#
	# 	print('is valid', serializer.is_valid())
	# 	if serializer.is_valid():
	# 		serializer.save(created_by=request.user, project=Project.objects.filter(name=self.kwargs['project_name']).first())
	# 		return Response(serializer.data, status=HTTP_201_CREATED)
	# 	return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


	def get_queryset(self):
		print('get_queryset')
		return LinkPack.objects.filter(project__name=self.kwargs['project_name'])

	def perform_create(self, serializer):
		# todo: validate self.request
		print('perform create', self.request.data)
		from django.core.exceptions import ValidationError as django_ValidationError
		from rest_framework.serializers import ValidationError as serializer_ValidationError
		try:
			return serializer.save(
				created_by=self.request.user,
				project=Project.objects.filter(name=self.kwargs['project_name']).first()
			)
		except django_ValidationError as e:
			raise serializer_ValidationError(e.messages)

	@detail_route(methods=['GET'])
	def get_file(self, request, *args, **kwargs):
		from django.http import HttpResponse
		qs = LinkPack.objects.filter(pk=self.kwargs['pk']).first()

		response = HttpResponse(qs.to_file(), content_type='text/plain', )
		response['Content-Disposition'] = 'attachment; filename="{project_name}_{panel}_links.txt"'.format(
			project_name=qs.project.name,
			panel=qs.panel
		)
		response['Access-Control-Expose-Headers'] = 'Content-Disposition'
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


class ChangePasswordViewSet(APIView):
	"""
	An endpoint for changing password.
	"""
	# permission_classes = (permissions.IsAuthenticated, )
	# queryset = User.objects.all()
	serializer_class = ChangePasswordSerializer
	# model = User

	# def get_object(self, queryset=None):
	# 	return self.request.user

	def put(self, request, *args, **kwargs):
		# self.object = self.get_object()
		serializer = ChangePasswordSerializer(data=request.data)

		if serializer.is_valid():
			# Check old password
			if not request.user.check_password(serializer.data.get('old_password')):
				return Response({'old_password': ['Wrong password.']}, status=HTTP_400_BAD_REQUEST)
			# set_password also hashes the password that the user will get
			request.user.set_password(serializer.data.get('new_password'))
			request.user.save()
			update_session_auth_hash(request, request.user)
			return Response(status=HTTP_204_NO_CONTENT)

		return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
