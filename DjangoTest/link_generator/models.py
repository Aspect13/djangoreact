from django.contrib.auth.models import User
from django.db import models
from django.http import QueryDict


def get_chk(pid):
	return str(pow(sum([ord(sChar) for sChar in str(pid)]), 3))[-3:]


class Project(models.Model):
	class Meta:
		ordering = ('-creation_date', 'name')
		get_latest_by = '-creation_date'

	name = models.CharField(max_length=100, unique=True,)
	created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	creation_date = models.DateTimeField(auto_now_add=True)
	link_packs_length = models.PositiveIntegerField(default=0,)
	# link_pack = models.ForeignKey(LinkPack, )

	def __str__(self):
		return self.name


class LinkPack(models.Model):

	class Meta:
		ordering = ('-creation_date', )

	# class Meta:
	# 	verbose_name = 'Ссылка'
	# 	verbose_name_plural = 'Ссылки'
	project = models.ForeignKey(Project, on_delete=models.CASCADE, )
	created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
	creation_date = models.DateTimeField(auto_now_add=True)

	base_url = models.CharField(max_length=300, default='https://ktsrv.com/mrIWeb/mrIWeb.dll')
	panel = models.CharField(max_length=10, default='GEN25')
	extra_params = models.CharField(max_length=1000, blank=True)

	link_amount = models.PositiveIntegerField(default=50000)
	pid_start_with = models.PositiveIntegerField(default=1)
	link_template = models.CharField(max_length=40, default='{pid}')

	make_shuffle = models.BooleanField(default=True)

	default_params = '&id=1&rs=1'

	def save(self, *args, **kwargs):
		self.project.link_packs_length += 1
		self.project.save()
		super().save(*args, **kwargs)  # Call the "real" save() method.

	def delete(self, *args, **kwargs):
		self.project.link_packs_length -= 1
		self.project.save()
		super().save(*args, **kwargs)  # Call the "real" save() method.

	@staticmethod
	def random_shuffle(d):
		from random import shuffle
		keys = list(d.keys())
		shuffle(keys)
		return dict((key, d[key]) for key in keys)

	def __str__(self):
		d = {
			'pid': 'auto',
			'chk': 'na',
			'debug': 5,
			'ck': 1,
			'i.test': 1,
		}

		return self.get_link(d)

	def get_link(self, params_dict):
		# params = QueryDict('', mutable=True)
		params = {
			'i.project': self.project.name,
			's': self.panel,
		}
		params.update(params_dict)
		params.update(QueryDict(self.default_params))
		params.update(QueryDict(self.extra_params))

		for k, v in params.items():
			if isinstance(v, list):
				params[k] = v[0]

		result_params = QueryDict('', mutable=True)
		result_params.update(self.random_shuffle(params) if self.make_shuffle else params)

		return '{base_url}?{params}'.format(base_url=self.base_url, params=result_params.urlencode())

	def to_file(self):
		from django.utils.six import StringIO
		# from time import time
		io_file = StringIO()
		# link_file = open('{project_name}_{panel}_links'.format(project_name=self.project.name, panel=self.panel), 'wb')
		io_file.write('{}\n'.format('\t'.join(['PID', 'SurveyLink'])))
		for pid in range(self.pid_start_with, self.pid_start_with + self.link_amount):
			# self.generate_link(pid)
			real_pid = self.link_template.format(pid=pid)
			d = {
				'pid': real_pid,
				'chk': get_chk(real_pid),
			}

			lnk = self.get_link(d)

			io_file.write('{pid}\t{survey_link}\n'.format(pid=real_pid, survey_link=lnk))

		return io_file.getvalue()


# class LinkSet(models.Model):
#
# 	# def chk(self):
# 	# 	return 'na'
# 	#
# 	# @property
# 	# def pid_default(self):
# 	# 	return self.id
#
# 	# @property
# 	# def survey_link(self):
# 	# 	params = {
# 	# 		's': self.panel,
# 	# 		'id': 1,
# 	# 		'rs': 1,
# 	# 		'chk': self.chk,
# 	# 		'pid': self.pid,
# 	# 		'extra_params': self.extra_params
# 	# 	}
# 	#
# 	# 	lnk = '{base_url}?i.project={project_name}'.format(base_url=self.base_url, project_name=self.package.project.name)
# 	# 	return models.CharField(max_length=1000, default=lnk)
#
# 	class Meta:
# 		unique_together = (('id', 'panel'), )
#
# 	base_url = models.CharField(max_length=300, default='https://ktsrv.com/mrIWeb/mrIWeb.dll')
# 	package = models.ForeignKey(LinkPack, on_delete=models.CASCADE)
# 	# pid = models.CharField(max_length=100, default=)
#
# 	panel = models.CharField(max_length=10)
# 	# survey_link = models.CharField(max_length=1000, )
# 	extra_params = models.CharField(max_length=1000, blank=True)
#
# 	def __str__(self):
# 		return '{}{}'.format(self.base_url, '?jopa')
