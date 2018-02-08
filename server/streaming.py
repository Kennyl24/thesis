# import pyspark_cassandra
# import pyspark_cassandra.streaming

# from pyspark_cassandra import CassandraSparkContext
from pyspark.sql import SQLContext
from pyspark import SparkContext, SparkConf
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
from uuid import uuid1
import json
# sc = CassandraSparkContext(conf=conf)
# sql = SQLContext(sc)
conf = SparkConf()
conf.setMaster("local[4]")
conf.setAppName("Myapplication")
conf.set("spark.executor.memory", "2g")
sc = SparkContext(conf = conf)
stream = StreamingContext(sc, 2)
# lines = stream.socketTextStream("localhost", 9999)
kafkastream = KafkaUtils.createStream(stream, "localhost:2181", "Myapplication", {"newTop12": 1} )
# testy = kafkastream.map(lambda line: line.decode('ascii'))
parsed = kafkastream.map(lambda (k, v): json.loads(v))
parsed.pprint()
# unifiedStream = StreamingContext.union(stream, kafka_stream)
# 
# valuestream = kafkastream.map(lambda value: _.value())
# offsetRanges = []

# def storeOffsetRanges(rdd):
#      global offsetRanges
#      offsetRanges = rdd.offsetRanges()
#      return rdd

# def printOffsetRanges(rdd):
#     # print rdd
#      for o in offsetRanges:
#          print "%s %s %s %s" % (o.topic, o.partition, o, o.untilOffset)

# kafkastream.countByValue()
# print(valuestream)
# print(kafka_stream)
# print(unifiedStream)
# summed = value.map(lambda event: (event['site_id'], 1)).\
#                 reduceByKey(lambda x: x + y).\
#                 map(lambda x: {"site_id": x[0], "ts": str(uuid1()), "pageviews": x[1]})
# print(parsed)
# summed.saveToCassandra("killranalytics", "real_time_data")
stream.start()
stream.awaitTermination()