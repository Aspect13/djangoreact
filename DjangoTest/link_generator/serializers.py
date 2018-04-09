from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.fields import DateTimeField, SlugField
from rest_framework.relations import HyperlinkedIdentityField
from rest_framework_nested.relations import NestedHyperlinkedRelatedField

from link_generator.models import Project, LinkPack


# class UserSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = User
# 		# fields = ('username', 'email',)
# 		fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
	class Meta:
		model = Project
		fields = '__all__'
	created_by = serializers.ReadOnlyField(source='created_by.username')
	creation_date = DateTimeField(format='%d-%m-%Y %H:%M:%S', read_only=True)

	# created_by = UserSerializer(read_only=True)

	linkpacks = HyperlinkedIdentityField(
		view_name='project-linkpacks-list',
		lookup_url_kwarg='project_name',
		lookup_field='name'
	)

	# linkpacks = NestedHyperlinkedRelatedField(
	# 	many=True,
	# 	read_only=True,
	# 	view_name='project-linkpacks-detail',
	# 	parent_lookup_kwargs={'project_pk': 'project__pk'}
	# )


class LinkPackSerializer(serializers.ModelSerializer):
	class Meta:
		model = LinkPack
		# fields = ('project', 'creation_date', 'created_by')
		fields = '__all__'
	# project = ProjectSerializer()
	created_by = serializers.ReadOnlyField(source='created_by.username', read_only=True)
	creation_date = DateTimeField(format='%d-%m-%Y %H:%M:%S', read_only=True)
	project = serializers.ReadOnlyField(source='project.name')

	# def validate(self, attrs):
	# 	print('validate attrs', attrs)

	# def create(self, data):
	# 	print('validating create', data)
	# 	if False:
	# 		raise serializers.ValidationError('Your data is shit')
	# 	return data

	# def validate_project(self, data):
	# 	print('validating project', data)
	# 	if False:
	# 		raise serializers.ValidationError('Your data is shit')
	# 	return data

	# links = HyperlinkedIdentityField(
	# 	view_name='project-linkpacks-linkset-list',
	# 	lookup_url_kwarg='linkpacks',
	# 	# lookup_field='id'
	# )


# class LinkSetSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = LinkSet
# 		fields = '__all__'
