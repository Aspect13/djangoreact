from django.contrib.auth.models import User
from django.db import models

# Create your models here.

# makemigrations -> mirate


class Project(models.Model):
	name = models.CharField(max_length=100, unique=True,)
	created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	creation_date = models.DateTimeField(auto_now_add=True)
	# link_pack = models.ForeignKey(LinkPack, )

	class Meta:
		ordering = ('-creation_date', 'name')
		get_latest_by = '-creation_date'

	def __str__(self):
		return self.name


class LinkPack(models.Model):
	# class Meta:
	# 	verbose_name = 'Ссылка'
	# 	verbose_name_plural = 'Ссылки'
	project = models.ForeignKey(Project, on_delete=models.CASCADE, )
	created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	creation_date = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-creation_date', )

	def __str__(self):
		return 'Pack {}; for project: {}; created by {}'.format(self.id, self.project.name, self.created_by)


class LinkSet(models.Model):

	# def chk(self):
	# 	return 'na'
	#
	# @property
	# def pid_default(self):
	# 	return self.id

	# @property
	# def survey_link(self):
	# 	params = {
	# 		's': self.panel,
	# 		'id': 1,
	# 		'rs': 1,
	# 		'chk': self.chk,
	# 		'pid': self.pid,
	# 		'extra_params': self.extra_params
	# 	}
	#
	# 	lnk = '{base_url}?i.project={project_name}'.format(base_url=self.base_url, project_name=self.package.project.name)
	# 	return models.CharField(max_length=1000, default=lnk)

	class Meta:
		unique_together = (('pid', 'panel'), )

	base_url = models.CharField(max_length=300, default='https://ktsrv.com/mrIWeb/mrIWeb.dll')
	package = models.ForeignKey(LinkPack, on_delete=models.CASCADE)
	pid = models.CharField(max_length=100, )

	panel = models.CharField(max_length=10)
	# survey_link = models.CharField(max_length=1000, )
	extra_params = models.CharField(max_length=1000, blank=True)

	def __str__(self):
		return '{}{}'.format(self.base_url, '?jopa')
