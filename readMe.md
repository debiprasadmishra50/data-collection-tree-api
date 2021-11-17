# Data Collection Tree

---

Built using Node JS, Express, MongoDB and Mongoose

### Start application using

`npm start`

## **End points**

`http://127.0.0.1:8000`: Base URL

Insert a record: `/api/v1/data/insert`

GET record for a country: `/api/v1/data/query`

## **Demo Records to Insert**

---

1. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "mobile"
           },
           {
               "key": "country",
               "val": "IN"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 200
           },
           {
               "key": "timespent",
               "val": 100
           }
       ]
   }
   ```

2. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "web"
           },
           {
               "key": "country",
               "val": "IN"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 1000
           },
           {
               "key": "timespent",
               "val": 200
           }
       ]
   }
   ```

3. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "tablet"
           },
           {
               "key": "country",
               "val": "IN"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 300
           },
           {
               "key": "timespent",
               "val": 70
           }
       ]
   }
   ```

4. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "mobile"
           },
           {
               "key": "country",
               "val": "US"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 1000
           },
           {
               "key": "timespent",
               "val": 400
           }
       ]
   }
   ```

5. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "tablet"
           },
           {
               "key": "country",
               "val": "US"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 1000
           },
           {
               "key": "timespent",
               "val": 300
           }
       ]
   }
   ```

6. ```json
   {
       "dim": [
           {
               "key": "device",
               "val": "web"
           },
           {
               "key": "country",
               "val": "US"
           }
       ],
       "metrics": [
           {
               "key": "webreq",
               "val": 5000
           },
           {
               "key": "timespent",
               "val": 800
           }
       ]
   }
   ```

### **Output for insertion**

```json
{
    "status": "success",
    "message": "Data Updated"
}
```

## **Demo Record for querying**

---

1. ```json
   {
       "dim": [
           {
               "key": "country",
               "val": "IN"
           }
       ]
   }
   ```

2. ```json
   {
       "dim": [
           {
               "key": "country",
               "val": "US"
           }
       ]
   }
   ```

### **Output for querying**

```json
{
    "status": "success",
    "data": {
        "dim": [
            {
                "key": "country",
                "val": "IN"
            }
        ],
        "metrics": [
            {
                "key": "webreq",
                "val": 2250
            },
            {
                "key": "timespent",
                "val": 650
            }
        ]
    }
}
```
