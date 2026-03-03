from django.core.management.base import BaseCommand
from portfolio.models import Portfolio

class Command(BaseCommand):
    help = 'Prints all portfolio names'

    def handle(self, *args, **kwargs):
        self.stdout.write("Portfolios:")
        for portfolio in Portfolio.objects.all():
            self.stdout.write(f" - {portfolio.name}")