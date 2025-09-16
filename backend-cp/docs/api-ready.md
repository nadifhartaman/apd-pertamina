### API Camera 

1. GET http://localhost:3001/api/cameras

2. CREATE http://localhost:3001/api/cameras

payload:

```
{
    "name": "Camera Simpang A",
    "link": "http://example.com/stream",
    "location": "Bandung Timur",
    "status": "active" //inactive or active
}
```

3. UPDATE http://localhost:3001/api/cameras/1

payload:

```
{
    "name": "Camera 1",
    "link": "http://example.com/stream",
    "location": "Lab Iot Lt.9",
    "status": "active" //inactive or active
}
```

4. DELETE http://localhost:3001/api/cameras/1

### API People Counting 

1. GET http://localhost:3001/api/people/hourly

2. GET http://localhost:3001/api/people/hourly/total

3. GET http://localhost:3001/api/people/hourly/1