from django.core.management.base import BaseCommand
from django.utils import timezone

from analytics.models import StockAnalytics
from analytics.services.clean_data import clean_data
from analytics.services.fetch_data import fetch_data
from analytics.services.indicators import indicators
from analytics.services.opportunity_engine import opportunity_engine
from analytics.services.plot_data import plot_data
from portfolio.models import Stock


class Command(BaseCommand):
    help = "Run mock analytics pipeline and persist StockAnalytics records."

    def handle(self, *args, **options):
        count = 0
        for stock in Stock.objects.all():
            raw_df = fetch_data(stock.symbol)
            cleaned_df = clean_data(raw_df)
            indicator_data = indicators(cleaned_df, stock.symbol)
            score = opportunity_engine(
                pe_ratio=indicator_data["pe_ratio"],
                discount_level=indicator_data["discount_level"],
            )
            graph_json = plot_data(cleaned_df)

            StockAnalytics.objects.update_or_create(
                stock=stock,
                defaults={
                    "pe_ratio": indicator_data["pe_ratio"],
                    "discount_level": indicator_data["discount_level"],
                    "opportunity_score": score,
                    "graph_data": graph_json,
                    "last_updated": timezone.now(),
                },
            )
            count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Analytics completed successfully for {count} stocks.")
        )
