# Generated by Django 3.1.4 on 2021-01-07 16:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0018_post_wordiness'),
    ]

    operations = [
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('wordiness', models.IntegerField(blank=True, default=0)),
                ('order_key', models.IntegerField(blank=True, default=0)),
                ('description', models.TextField(blank=True, default='', max_length=1000)),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='post.image')),
            ],
        ),
    ]
